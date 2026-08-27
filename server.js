import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import 'dotenv/config';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const httpsPort = Number(process.env.HTTPS_PORT || 3443);
const tlsKeyPath = process.env.TLS_KEY_PATH ? path.resolve(root, process.env.TLS_KEY_PATH) : '';
const tlsCertPath = process.env.TLS_CERT_PATH ? path.resolve(root, process.env.TLS_CERT_PATH) : '';
const tlsOptions = tlsKeyPath && tlsCertPath && existsSync(tlsKeyPath) && existsSync(tlsCertPath)
  ? { key: readFileSync(tlsKeyPath), cert: readFileSync(tlsCertPath) }
  : null;
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || '123456';
const sessions = new Map();
const loginAttempts = new Map();
const database = new DatabaseSync(path.join(root, 'data', 'volkswagen.sqlite'));
database.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS message_replies (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL,
    direction TEXT NOT NULL DEFAULT 'out',
    external_id TEXT
  )
`);
const replyColumns = database.prepare('PRAGMA table_info(message_replies)').all();
if (!replyColumns.some((column) => column.name === 'direction')) database.exec("ALTER TABLE message_replies ADD COLUMN direction TEXT NOT NULL DEFAULT 'out'");
if (!replyColumns.some((column) => column.name === 'external_id')) database.exec('ALTER TABLE message_replies ADD COLUMN external_id TEXT');
const messageColumns = database.prepare('PRAGMA table_info(messages)').all();
if (!messageColumns.some((column) => column.name === 'read_at')) database.exec('ALTER TABLE messages ADD COLUMN read_at TEXT');
if (!messageColumns.some((column) => column.name === 'deleted_at')) database.exec('ALTER TABLE messages ADD COLUMN deleted_at TEXT');
if (!replyColumns.some((column) => column.name === 'deleted_at')) database.exec('ALTER TABLE message_replies ADD COLUMN deleted_at TEXT');
const insertMessage = database.prepare('INSERT INTO messages (id, name, email, message, type, created_at) VALUES (?, ?, ?, ?, ?, ?)');
const listMessages = database.prepare('SELECT id, name, email, message, type, created_at AS createdAt, read_at AS readAt FROM messages WHERE deleted_at IS NULL ORDER BY created_at DESC');
const listTrash = database.prepare("SELECT id, name, email, message, type, created_at AS createdAt, deleted_at AS deletedAt FROM messages WHERE deleted_at IS NOT NULL AND deleted_at > datetime('now', '-15 days') ORDER BY deleted_at DESC");
const listTrashReplies = database.prepare("SELECT id, message_id AS messageId, email, subject, text, created_at AS createdAt, direction FROM message_replies WHERE deleted_at IS NOT NULL AND deleted_at > datetime('now', '-15 days') ORDER BY created_at ASC");
const moveConversationToTrash = database.prepare('UPDATE messages SET deleted_at = ? WHERE email = ? AND deleted_at IS NULL');
const moveRepliesToTrash = database.prepare('UPDATE message_replies SET deleted_at = ? WHERE email = ? AND deleted_at IS NULL');
const restoreConversation = database.prepare('UPDATE messages SET deleted_at = NULL WHERE email = ?');
const restoreReplies = database.prepare('UPDATE message_replies SET deleted_at = NULL WHERE email = ?');
const purgeTrash = database.prepare("DELETE FROM message_replies WHERE deleted_at IS NOT NULL AND deleted_at <= datetime('now', '-15 days')");
const purgeTrashMessages = database.prepare("DELETE FROM messages WHERE deleted_at IS NOT NULL AND deleted_at <= datetime('now', '-15 days')");
const markMessagesRead = database.prepare('UPDATE messages SET read_at = ? WHERE email = ? AND read_at IS NULL');
const insertReply = database.prepare('INSERT INTO message_replies (id, message_id, email, subject, text, created_at) VALUES (?, ?, ?, ?, ?, ?)');
const listReplies = database.prepare('SELECT id, message_id AS messageId, email, subject, text, created_at AS createdAt, direction FROM message_replies WHERE deleted_at IS NULL ORDER BY created_at ASC');
const insertIncomingReply = database.prepare('INSERT INTO message_replies (id, message_id, email, subject, text, created_at, direction, external_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const hasExternalReply = database.prepare('SELECT 1 FROM message_replies WHERE external_id = ?');
const findConversation = database.prepare('SELECT id, email FROM messages WHERE lower(email) = lower(?) ORDER BY created_at DESC LIMIT 1');
const mailTransport = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
  ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT || 587) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } })
  : null;
const imapHost = process.env.IMAP_HOST || (process.env.SMTP_HOST === 'smtp.gmail.com' ? 'imap.gmail.com' : '');
const imapUser = process.env.IMAP_USER || process.env.SMTP_USER;
const imapPassword = process.env.IMAP_PASSWORD || process.env.SMTP_PASSWORD;
const imapEnabled = imapHost && imapUser && imapPassword;
let imapBusy = false;
async function syncIncomingReplies() {
  if (!imapEnabled || imapBusy) return;
  imapBusy = true;
  const client = new ImapFlow({ host: imapHost, port: Number(process.env.IMAP_PORT || 993), secure: true, auth: { user: imapUser, pass: imapPassword }, logger: false });
  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    try {
      const recentUids = await client.search({ since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) });
      for await (const message of client.fetch(recentUids, { envelope: true, source: true })) {
        const parsed = await simpleParser(message.source);
        const externalId = parsed.messageId || `${message.uid}`;
        if (hasExternalReply.get(externalId)) continue;
        const email = parsed.from?.value?.[0]?.address;
        if (!email || email.toLowerCase() === String(imapUser).toLowerCase()) continue;
        const original = findConversation.get(email);
        if (!original) continue;
        insertIncomingReply.run(crypto.randomUUID(), original.id, email, parsed.subject || 'E-posta yanıtı', parsed.text || '', (parsed.date || new Date()).toISOString(), 'in', externalId);
        await client.messageFlagsAdd(message.uid, ['\\Seen']);
      }
    } finally { lock.release(); }
  } finally {
    await client.logout().catch(() => client.close());
    imapBusy = false;
  }
}
const officialModelsUrl = 'https://binekarac.vw.com.tr/tr/modeller-fiyatlar/arac-modelleri.html';
const modelNames = {
  golf: 'Golf',
  't-roc': 'T-Roc',
  tiguan: 'Tiguan',
  polo: 'Polo',
  passat: 'Passat',
  touareg: 'Touareg',
};
const fallbackImages = {
  golf: '/img/golf.png',
  't-roc': '/img/troc.png',
  tiguan: '/img/tiguan.png',
  polo: '/img/polo.png',
  passat: '/img/passat.png',
  touareg: '/img/touareg.png',
};

let officialPage;
let pageFetchedAt = 0;

async function getOfficialPage() {
  if (officialPage && Date.now() - pageFetchedAt < 15 * 60 * 1000) return officialPage;
  const response = await fetch(officialModelsUrl, {
    headers: { 'user-agent': 'Volkswagen-showcase/1.0' },
  });
  if (!response.ok) throw new Error(`Official page request failed: ${response.status}`);
  officialPage = await response.text();
  pageFetchedAt = Date.now();
  return officialPage;
}

function extractImage(html, modelName) {
  const decoded = html.replaceAll('\\u002F', '/').replaceAll('\\/', '/');
  const modelIndex = decoded.toLowerCase().indexOf(`carlinename%5c%22:%5c%22${modelName.toLowerCase()}`);
  const start = modelIndex >= 0 ? modelIndex : decoded.toLowerCase().indexOf(`carlinename":"${modelName.toLowerCase()}`);
  const section = decoded.slice(Math.max(0, start), Math.max(0, start) + 20000);
  const match = section.match(/https:\/\/media\.vw\.mediaservice\.avp\.tech\/media\/fast\/[A-Za-z0-9_?&=%./-]+/);
  return match?.[0]?.replaceAll('%5C', '') || null;
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...securityHeaders(response),
  });
  response.end(JSON.stringify(data));
}

function securityHeaders(response) {
  const headers = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  };
  if (tlsOptions) headers['strict-transport-security'] = 'max-age=31536000; includeSubDomains';
  return headers;
}

function readCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map((part) => {
    const [key, ...value] = part.trim().split('=');
    return [key, decodeURIComponent(value.join('='))];
  }));
}

function isAuthenticated(request) {
  const token = readCookies(request).admin_session;
  const session = token && sessions.get(token);
  if (!session || session.expires < Date.now()) {
    if (token) sessions.delete(token);
    return false;
  }
  session.expires = Date.now() + 8 * 60 * 60 * 1000;
  return true;
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10000) request.destroy(new Error('Request body too large'));
    });
    request.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    request.on('error', reject);
  });
}

const requestHandler = async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    if (!adminPassword) return sendJson(response, 503, { error: 'ADMIN_PASSWORD ortam değişkeni tanımlanmalı.' });
    const ip = request.socket.remoteAddress || 'unknown';
    const attempt = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };
    if (attempt.blockedUntil > Date.now()) return sendJson(response, 429, { error: 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin.' });
    try {
      const body = await parseBody(request);
      if (body.username !== adminUser) {
        attempt.count += 1;
        loginAttempts.set(ip, attempt);
        return sendJson(response, 401, { error: 'Kullanıcı adı hatalı.' });
      }
      const submitted = crypto.createHash('sha256').update(String(body.password || '')).digest();
      const expected = crypto.createHash('sha256').update(adminPassword).digest();
      if (!crypto.timingSafeEqual(submitted, expected)) {
        attempt.count += 1;
        if (attempt.count >= 5) { attempt.count = 0; attempt.blockedUntil = Date.now() + 15 * 60 * 1000; }
        loginAttempts.set(ip, attempt);
        return sendJson(response, 401, { error: 'Şifre hatalı.' });
      }
      loginAttempts.delete(ip);
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, { expires: Date.now() + 8 * 60 * 60 * 1000 });
      const secure = tlsOptions ? '; Secure' : '';
      response.writeHead(200, { 'content-type': 'application/json', 'set-cookie': `admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure}`, ...securityHeaders(response) });
      return response.end(JSON.stringify({ authenticated: true }));
    } catch (error) { return sendJson(response, 400, { error: error.message }); }
  }
  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    const token = readCookies(request).admin_session;
    if (token) sessions.delete(token);
    const secure = tlsOptions ? '; Secure' : '';
    response.writeHead(204, { 'set-cookie': `admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`, ...securityHeaders(response) });
    return response.end();
  }
  if (url.pathname === '/api/admin/messages' && request.method === 'GET') {
    if (!isAuthenticated(request)) return sendJson(response, 401, { error: 'Yetkisiz erişim.' });
    purgeTrash.run();
    purgeTrashMessages.run();
    const payload = { messages: listMessages.all(), replies: listReplies.all() };
    syncIncomingReplies().catch((error) => console.error(`IMAP senkronizasyonu başarısız: ${error.message}`));
    return sendJson(response, 200, payload);
  }
  if (url.pathname === '/api/admin/trash' && request.method === 'GET') {
    if (!isAuthenticated(request)) return sendJson(response, 401, { error: 'Yetkisiz erişim.' });
    purgeTrash.run();
    purgeTrashMessages.run();
    return sendJson(response, 200, { messages: listTrash.all(), replies: listTrashReplies.all() });
  }
  if (url.pathname === '/api/admin/conversation/delete' && request.method === 'POST') {
    if (!isAuthenticated(request)) return sendJson(response, 401, { error: 'Yetkisiz erişim.' });
    const body = await parseBody(request);
    const email = String(body.email || '').trim();
    if (!email) return sendJson(response, 422, { error: 'Kullanıcı e-postası gerekli.' });
    const deletedAt = new Date().toISOString();
    moveConversationToTrash.run(deletedAt, email);
    moveRepliesToTrash.run(deletedAt, email);
    return sendJson(response, 200, { deleted: true });
  }
  if (url.pathname === '/api/admin/conversation/restore' && request.method === 'POST') {
    if (!isAuthenticated(request)) return sendJson(response, 401, { error: 'Yetkisiz erişim.' });
    const body = await parseBody(request);
    const email = String(body.email || '').trim();
    if (!email) return sendJson(response, 422, { error: 'Kullanıcı e-postası gerekli.' });
    restoreConversation.run(email);
    restoreReplies.run(email);
    return sendJson(response, 200, { restored: true });
  }
  if (url.pathname === '/api/admin/messages/read' && request.method === 'POST') {
    if (!isAuthenticated(request)) return sendJson(response, 401, { error: 'Yetkisiz erişim.' });
    try {
      const body = await parseBody(request);
      const email = String(body.email || '').trim();
      if (!email) return sendJson(response, 422, { error: 'Kullanıcı e-postası gerekli.' });
      markMessagesRead.run(new Date().toISOString(), email);
      return sendJson(response, 200, { marked: true });
    } catch (error) { return sendJson(response, 400, { error: error.message }); }
  }
  if (url.pathname === '/api/admin/reply' && request.method === 'POST') {
    if (!isAuthenticated(request)) return sendJson(response, 401, { error: 'Yetkisiz erişim.' });
    if (!mailTransport) {
      return sendJson(response, 503, {
        error: 'E-posta gönderilemedi: SMTP ayarları eksik. Proje klasöründe .env dosyası oluşturup SMTP_USER ve SMTP_PASSWORD alanlarını doldurun, ardından sunucuyu yeniden başlatın.',
      });
    }
    try {
      const body = await parseBody(request);
      const to = String(body.to || '').trim();
      const subject = String(body.subject || '').trim();
      const text = String(body.text || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !subject || !text) return sendJson(response, 422, { error: 'Alıcı, konu ve mesaj zorunludur.' });
      await mailTransport.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text });
      const reply = { id: crypto.randomUUID(), messageId: String(body.messageId || ''), email: to, subject, text, createdAt: new Date().toISOString() };
      insertReply.run(reply.id, reply.messageId, reply.email, reply.subject, reply.text, reply.createdAt);
      return sendJson(response, 200, { sent: true, reply });
    } catch (error) { return sendJson(response, 502, { error: `E-posta gönderilemedi: ${error.message}` }); }
  }
  if (url.pathname === '/api/messages' && request.method === 'POST') {
    try {
      const body = await parseBody(request);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim();
      const message = String(body.message || '').trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) return sendJson(response, 422, { error: 'Geçerli ad, e-posta ve mesaj gerekli.' });
      insertMessage.run(crypto.randomUUID(), name, email, message, body.type === 'quote' ? 'Teklif' : 'İletişim', new Date().toISOString());
      return sendJson(response, 201, { saved: true });
    } catch (error) { return sendJson(response, 400, { error: error.message }); }
  }
  if (url.pathname === '/api/model-images') {
    try {
      const html = await getOfficialPage();
      const images = Object.entries(modelNames).reduce((result, [slug, name]) => {
        result[slug] = extractImage(html, name) || fallbackImages[slug];
        return result;
      }, {});
      sendJson(response, 200, { source: officialModelsUrl, images, fetchedAt: new Date(pageFetchedAt).toISOString() });
    } catch (error) {
      sendJson(response, 502, { error: 'Resmî görsel servisine ulaşılamadı.', details: error.message, images: fallbackImages });
    }
    return;
  }

  // React routes must resolve to the app shell so direct links such as /admin work.
  const requestedPath = url.pathname === '/' || !path.extname(url.pathname) ? '/index.html' : url.pathname;
  const relativePath = requestedPath.replace(/^\/+/, '');
  const filePath = relativePath.startsWith('img/') || relativePath === 'img'
    ? path.join(publicRoot, relativePath)
    : path.join(root, relativePath);
  try {
    const content = await readFile(filePath);
    const extension = path.extname(filePath);
    const contentTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
    response.writeHead(200, {
      'content-type': contentTypes[extension] || 'application/octet-stream',
      'cache-control': extension === '.html' ? 'no-store' : 'public, max-age=3600',
      ...securityHeaders(response),
    });
    response.end(content);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', ...securityHeaders(response) });
    response.end('Not found');
  }
};

if (tlsOptions) {
  https.createServer(tlsOptions, requestHandler).listen(httpsPort, () => {
    console.log(`Volkswagen HTTPS server running at https://localhost:${httpsPort}`);
  });
  http.createServer((request, response) => {
    const host = request.headers.host ? request.headers.host.split(':')[0] : 'localhost';
    response.writeHead(308, { location: `https://${host}:${httpsPort}${request.url}` });
    response.end();
  }).listen(port, () => console.log(`HTTP redirects to HTTPS on port ${port}`));
} else {
  http.createServer(requestHandler).listen(port, () => {
    console.log(`Volkswagen server running at http://localhost:${port}`);
    console.log('TLS sertifikasi bulunamadı; HTTPS için TLS_KEY_PATH ve TLS_CERT_PATH ayarlayın.');
  });
}
if (imapEnabled) {
  syncIncomingReplies().catch((error) => console.error(`IMAP senkronizasyonu başarısız: ${error.message}`));
  setInterval(() => syncIncomingReplies().catch((error) => console.error(`IMAP senkronizasyonu başarısız: ${error.message}`)), 60 * 1000);
}
