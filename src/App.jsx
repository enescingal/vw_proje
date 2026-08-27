import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Menu, Phone, X } from 'lucide-react';

const models = [
  { name: 'Golf', type: 'Hatchback', image: '/img/golf.png', price: '1.745.000 TL', slug: 'golf', tagline: 'Sürüş keyfinin ikonik hali.', description: 'Yeni Golf, zamansız tasarımı ve akıllı teknolojileriyle her yolculuğu daha özel kılar.', power: '150 PS', consumption: '5,6 l/100 km', seats: '5' },
  { name: 'T-Roc', type: 'SUV', image: '/img/troc.png', price: '1.980.000 TL', slug: 't-roc', tagline: 'Şehrin ritmine ayak uydurur.', description: 'T-Roc, cesur SUV tasarımını çevik sürüş ve günlük kullanım kolaylığıyla buluşturur.', power: '150 PS', consumption: '6,2 l/100 km', seats: '5' },
  { name: 'Tiguan', type: 'SUV', image: '/img/tiguan.png', price: '2.485.000 TL', slug: 'tiguan', tagline: 'Her maceraya hazır.', description: 'Tiguan; geniş yaşam alanı, güvenlik teknolojileri ve konforuyla aileniz için tasarlandı.', power: '204 PS', consumption: '6,5 l/100 km', seats: '5' },
  { name: 'Polo', type: 'Hatchback', image: '/img/polo.png', price: '1.290.000 TL', slug: 'polo', tagline: 'Kompakt, enerjik, özgür.', description: 'Polo, şehir hayatında pratikliği ve Volkswagen mühendisliğini bir araya getirir.', power: '95 PS', consumption: '5,2 l/100 km', seats: '5' },
  { name: 'Passat', type: 'Station Wagon', image: '/img/passat.png', price: '2.690.000 TL', slug: 'passat', tagline: 'Uzun yolların yeni standardı.', description: 'Passat, geniş iç hacmi ve üst düzey konforuyla uzun yolculukların vazgeçilmezi.', power: '150 PS', consumption: '5,7 l/100 km', seats: '5' },
  { name: 'Touareg', type: 'Premium SUV', image: '/img/touareg.png', price: '4.850.000 TL', slug: 'touareg', tagline: 'Premium deneyimin güçlü yorumu.', description: 'Touareg, güçlü performansını rafine konfor ve ileri teknolojiyle tamamlar.', power: '340 PS', consumption: '8,4 l/100 km', seats: '5' },
];
const defaultPackages = ['Life', 'Style', 'R-Line'];
const getPackages = (model) => model.packages || defaultPackages.map((name, index) => ({ name, price: index === 0 ? model.price : '' }));
const readCatalog = () => {
  try {
    const stored = localStorage.getItem('vw-model-catalog');
    return stored ? JSON.parse(stored) : models;
  } catch {
    return models;
  }
};

const pages = {
  '/': { title: 'Volkswagen Türkiye | Yeni Nesil Sürüş', description: 'Volkswagen modellerini keşfedin ve size uygun otomobili bulun.' },
  '/modeller': { title: 'Volkswagen Modelleri | Tüm Modeller', description: 'Volkswagen hatchback, SUV ve premium modellerini karşılaştırın.' },
  '/fiyatlar': { title: 'Volkswagen Fiyat Listesi | Güncel Fiyatlar', description: 'Volkswagen modellerinin güncel anahtar teslim fiyatlarını inceleyin.' },
  '/iletisim': { title: 'İletişim ve Destek | Volkswagen', description: 'Volkswagen hakkında bilgi alın, size ulaşmamız için formu doldurun.' },
  '/admin': { title: 'Yönetim Paneli | Volkswagen', description: 'Volkswagen katalog yönetim paneli.' },
};
models.forEach((model) => {
  pages[`/modeller/${model.slug}`] = {
    title: `Volkswagen ${model.name} | Özellikler ve Fiyat`,
    description: `${model.name} modelini keşfedin: tasarım, teknoloji, performans ve güncel fiyat bilgileri.`,
  };
});

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Header({ currentPath }) {
  const [open, setOpen] = useState(false);
  const links = [['Anasayfa', '/'], ['Modeller', '/modeller'], ['Fiyat Listesi', '/fiyatlar'], ['İletişim', '/iletisim']];
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">İçeriğe geç</a>
      <div className="topbar"><span>Volkswagen dünyasına hoş geldiniz</span><a href="tel:+908502221989"><Phone size={14} /> 0850 222 19 89</a></div>
      <nav className="nav container" aria-label="Ana menü">
        <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} aria-label="Volkswagen ana sayfa">
          <img src="/img/vwlogo.png" alt="Volkswagen" />
        </a>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menüyü aç/kapat">
          {open ? <X /> : <Menu />}
        </button>
        {currentPath !== '/admin' && <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {links.map(([label, path]) => <a key={path} className={currentPath === path ? 'active' : ''} href={path} onClick={(e) => { e.preventDefault(); setOpen(false); navigate(path); }}>{label}</a>)}
          <a className="nav-cta" href="/iletisim" onClick={(e) => { e.preventDefault(); setOpen(false); navigate('/iletisim'); }}>Bize ulaşın <ArrowRight size={16} /></a>
        </div>}
      </nav>
    </header>
  );
}

function Seo({ path }) {
  const meta = pages[path] || pages['/'];
  useEffect(() => {
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [meta]);
  return null;
}

function ModelCard({ model }) {
  const openModel = () => navigate(`/modeller/${model.slug}`);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModel();
    }
  };
  return <article className="model-card" role="link" tabIndex="0" onClick={openModel} onKeyDown={handleKeyDown} aria-label={`Volkswagen ${model.name} model detaylarını aç`}>
    <div className="model-image"><img src={model.image} alt={`Volkswagen ${model.name}`} loading="lazy" /></div>
    <div className="model-info"><span className="eyebrow">{model.type}</span><h3>{model.name}</h3><p>Başlangıç fiyatı <strong>{model.price}</strong></p><a href={`/modeller/${model.slug}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModel(); }}>Modeli keşfet <ArrowRight size={16} /></a></div>
  </article>;
}

function Home({ models: catalog = models }) {
  return <main id="main-content">
    <section className="hero">
      <div className="hero-content container"><span className="eyebrow light">Yeni nesil mobilite</span><h1>Yolculuğunuzun<br /><em>en güzel hali.</em></h1><p>Hayatın her anına eşlik eden Volkswagen modellerini keşfedin.</p><a className="button button-light" href="/modeller" onClick={(e) => { e.preventDefault(); navigate('/modeller'); }}>Modelleri incele <ArrowRight size={18} /></a></div>
      <img className="hero-image" src="/img/1.jpg" alt="Volkswagen otomobil yolda" />
    </section>
    <section className="section container"><div className="section-heading"><div><span className="eyebrow">Volkswagen dünyası</span><h2>Size uygun modeli bulun</h2></div><a className="text-link" href="/modeller" onClick={(e) => { e.preventDefault(); navigate('/modeller'); }}>Tüm modeller <ArrowRight size={16} /></a></div><div className="model-grid">{catalog.map((model) => <ModelCard key={model.name} model={model} />)}</div></section>
    <section className="split-feature"><div className="feature-image"><img src="/img/f1.jpg" alt="Volkswagen yeni araç fırsatları" loading="lazy" /></div><div className="feature-copy"><span className="eyebrow">Hayalinizdeki otomobil</span><h2>Yeni aracınız sizi bekliyor</h2><p>Volkswagen kalitesi, güvenlik ve teknolojiyle tanışın. Size özel teklifleri keşfedin.</p><a className="button button-primary" href="/iletisim" onClick={(e) => { e.preventDefault(); navigate('/iletisim'); }}>Bilgi alın <ArrowRight size={18} /></a></div></section>
  </main>;
}

function Models({ models: catalog = models }) {
  return <main id="main-content" className="page-content container"><span className="eyebrow">Volkswagen modelleri</span><h1>Aradığınız otomobil<br /><em>burada.</em></h1><p className="lead">Şehir içinden uzun yolculuklara, her yaşam tarzına uygun bir Volkswagen var.</p><div className="filter-row"><span>6 model</span><button type="button">Tüm segmentler <ChevronDown size={16} /></button></div><div className="model-grid">{catalog.map((model) => <ModelCard key={model.name} model={model} />)}</div></main>;
}

function ModelDetail({ model }) {
  return <main id="main-content" className="model-detail">
    <section className="detail-hero">
      <div className="container detail-hero-inner"><div><a className="back-link" href="/modeller" onClick={(e) => { e.preventDefault(); navigate('/modeller'); }}>← Tüm modeller</a><span className="eyebrow">{model.type}</span><h1>Volkswagen<br /><em>{model.name}</em></h1><p>{model.tagline}</p><a className="button button-light" href="/iletisim" onClick={(e) => { e.preventDefault(); navigate('/iletisim'); }}>Teklif alın <ArrowRight size={18} /></a></div><img src={model.image} alt={`Volkswagen ${model.name} dış görünüm`} /></div>
    </section>
    <section className="detail-content container"><div className="detail-intro"><span className="eyebrow">Sizin için tasarlandı</span><h2>{model.name} ile tanışın</h2><p>{model.description}</p></div><div className="spec-grid"><div><strong>{model.power}</strong><span>Maksimum güç</span></div><div><strong>{model.consumption}</strong><span>Ortalama tüketim</span></div><div><strong>{model.seats}</strong><span>Koltuk kapasitesi</span></div><div><strong>{model.price}</strong><span>Başlangıç fiyatı</span></div></div><div className="packages"><h3>Donanım paketleri</h3><div className="package-grid">{getPackages(model).map((pack) => <article className="package-card" key={pack.name}><h4>{pack.name}</h4><strong>{pack.price || 'Fiyat bilgisi için iletişime geçin'}</strong></article>)}</div></div><div className="detail-actions"><a className="button button-primary" href="/iletisim" onClick={(e) => { e.preventDefault(); navigate('/iletisim'); }}>Test sürüşü talep edin <ArrowRight size={18} /></a><a className="text-link" href="/fiyatlar" onClick={(e) => { e.preventDefault(); navigate('/fiyatlar'); }}>Fiyat listesini görüntüle <ArrowRight size={16} /></a></div></section>
  </main>;
}

function Prices({ models: catalog = models }) {
  return <main id="main-content" className="page-content container"><span className="eyebrow">Güncel fiyatlar</span><h1>Volkswagen fiyat<br /><em>listesi.</em></h1><p className="lead">Fiyatlar tavsiye edilen anahtar teslim fiyatlardır. Güncel kampanyalar için bizimle iletişime geçebilirsiniz.</p><div className="price-table">{catalog.map((model) => <div className="price-row" key={model.name}><div><strong>{model.name}</strong><span>{model.type}</span></div><strong>{model.price}</strong><a href="/iletisim" onClick={(e) => { e.preventDefault(); navigate('/iletisim'); }}>Teklif al <ArrowRight size={16} /></a></div>)}</div></main>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const body = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch('/api/messages', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Mesaj gönderilemedi.');
      setSent(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSending(false);
    }
  };
  return <main id="main-content" className="page-content container contact-layout"><div><span className="eyebrow">İletişim ve destek</span><h1>Sizin için<br /><em>buradayız.</em></h1><p className="lead">Sorularınız, test sürüşü talepleriniz veya Volkswagen hakkında daha fazla bilgi için bize ulaşın.</p><div className="contact-detail"><Phone size={20} /><div><strong>0850 222 19 89</strong><span>Hafta içi 09:00 – 18:00</span></div></div></div><form className="contact-form" onSubmit={submit} aria-label="İletişim formu">{sent ? <div className="success"><Check size={32} /><h2>Mesajınız alındı.</h2><p>En kısa sürede sizinle iletişime geçeceğiz.</p></div> : <><label>Ad soyad<input required name="name" autoComplete="name" /></label><label>E-posta<input required type="email" name="email" autoComplete="email" /></label><label>Mesajınız<textarea required name="message" rows="4" /></label>{error && <p className="error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Gönderiliyor...' : 'Gönder'} <ArrowRight size={18} /></button></>}</form></main>;
}

function Admin() {
  const [catalog, setCatalog] = useState(() => {
    return readCatalog();
  });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('prices');
  const [messages, setMessages] = useState([]);
  const [messageError, setMessageError] = useState('');
  const [replies, setReplies] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState('');
  const [trash, setTrash] = useState([]);
  const [view, setView] = useState('inbox');
  const [selectedModelSlug, setSelectedModelSlug] = useState(catalog[0]?.slug || '');
  const updatePrice = (slug, price) => setCatalog((items) => items.map((item) => item.slug === slug ? { ...item, price } : item));
  const updatePackagePrice = (slug, packageName, price) => setCatalog((items) => items.map((item) => item.slug === slug ? { ...item, packages: getPackages(item).map((pack) => pack.name === packageName ? { ...pack, price } : pack) } : item));
  const saveCatalog = () => {
    localStorage.setItem('vw-model-catalog', JSON.stringify(catalog));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  const loadMessages = async ({ selectFirst = true, activate = true } = {}) => {
    if (activate) {
      setTab('messages');
      setView('inbox');
    }
    setMessageError('');
    try {
      const response = await fetch('/api/admin/messages');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Mesajlar yüklenemedi.');
      setMessages(result.messages);
      setReplies(result.replies || []);
      if (selectFirst) {
        const firstEmail = [...new Set([...result.messages.map((message) => message.email), ...(result.replies || []).map((reply) => reply.email)])][0];
        setSelectedConversation((current) => current || firstEmail || '');
        if (firstEmail) openConversation(firstEmail);
      }
    } catch (error) {
      setMessageError(error.message);
    }
  };
  const openConversation = async (email) => {
    setSelectedConversation(email);
    const response = await fetch('/api/admin/messages/read', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
    if (response.ok) setMessages((current) => current.map((message) => message.email === email ? { ...message, readAt: message.readAt || new Date().toISOString() } : message));
  };
  const deleteConversation = async (email) => {
    await fetch('/api/admin/conversation/delete', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
    loadMessages({ selectFirst: false });
  };
  const loadTrashData = async () => {
    const response = await fetch('/api/admin/trash');
    const result = await response.json();
    if (!response.ok) { setMessageError(result.error || 'Çöp kutusu yüklenemedi.'); return; }
    setTrash(result.messages);
  };
  const loadTrash = () => {
    setTab('messages');
    setView('trash');
    setMessageError('');
    loadTrashData();
  };
  const restoreConversation = async (email) => {
    await fetch('/api/admin/conversation/restore', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
    loadTrashData();
  };
  const sendReply = async (event, message) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/admin/reply', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...values, to: message.email, messageId: message.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'E-posta gönderilemedi.');
      setReplies((current) => [...current, result.reply]);
      form.reset();
    } catch (error) {
      setMessageError(error.message);
    }
  };
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    navigate('/');
  };
  useEffect(() => {
    loadMessages({ selectFirst: false, activate: false });
    loadTrashData();
  }, []);
  useEffect(() => {
    if (tab !== 'messages') return undefined;
    const interval = window.setInterval(() => loadMessages({ selectFirst: false }), 5000);
    return () => window.clearInterval(interval);
  }, [tab]);
  const conversationEmails = [...new Set([...messages.map((message) => message.email), ...replies.map((reply) => reply.email)])];
  const conversations = conversationEmails.map((email) => messages.find((message) => message.email === email) || { id: `reply-${email}`, name: 'Yanıt alıcısı', email, type: 'Yanıt' });
  const latestActivity = (email) => Math.max(...[...messages.filter((message) => message.email === email), ...replies.filter((reply) => reply.email === email)].map((item) => new Date(item.createdAt).getTime()));
  conversations.sort((a, b) => latestActivity(b.email) - latestActivity(a.email));
  const activeMessage = conversations.find((message) => message.email === selectedConversation) || conversations[0];
  const conversationMessages = messages.filter((message) => message.email === activeMessage?.email);
  const conversationReplies = replies.filter((reply) => reply.email === activeMessage?.email);
  const selectedModel = catalog.find((model) => model.slug === selectedModelSlug) || catalog[0];
  return <main id="main-content" className="page-content container admin-page"><div className="admin-heading"><div><span className="eyebrow">Yönetim paneli</span><h1>Site içerikleri<br /><em>kontrolünüzde.</em></h1></div><button className="button button-outline" type="button" onClick={logout}>Güvenli çıkış</button></div><div className="admin-tabs"><button className={tab === 'prices' ? 'active' : ''} type="button" onClick={() => { setTab('prices'); setView('inbox'); }}>Fiyatlar</button><button className={tab === 'messages' && view === 'inbox' ? 'active' : ''} type="button" onClick={() => loadMessages()}>Gelen mesajlar</button><button className={view === 'trash' ? 'active' : ''} type="button" onClick={loadTrash}>Çöp kutusu</button></div>{tab === 'prices' ? <section className="admin-prices" aria-label="Model ve paket fiyat yönetimi"><div className="model-price-tabs" role="tablist">{catalog.map((model) => <button className={selectedModel?.slug === model.slug ? 'active' : ''} type="button" role="tab" aria-selected={selectedModel?.slug === model.slug} onClick={() => setSelectedModelSlug(model.slug)} key={model.slug}>{model.name}</button>)}</div>{selectedModel && <div className="package-editor"><div className="package-editor-heading"><div><span className="eyebrow">{selectedModel.type}</span><h2>{selectedModel.name} fiyatları</h2></div><label>Başlangıç fiyatı<input value={selectedModel.price} onChange={(event) => updatePrice(selectedModel.slug, event.target.value)} /></label></div><div className="package-grid">{getPackages(selectedModel).map((pack) => <label className="package-price" key={pack.name}><strong>{pack.name}</strong><span>Paket fiyatı</span><input value={pack.price} onChange={(event) => updatePackagePrice(selectedModel.slug, pack.name, event.target.value)} placeholder="Örn. 1.900.000 TL" /></label>)}</div><button className="button button-primary" type="button" onClick={saveCatalog}>{saved ? 'Kaydedildi' : 'Değişiklikleri kaydet'}</button></div>}</section> : view === 'trash' ? <section className="trash-list">{trash.length ? trash.map((item) => <article className="message-item" key={item.email}><strong>{item.name} · {item.email}</strong><p>{item.message}</p><small>15 gün içinde otomatik silinir.</small><button className="button button-primary" type="button" onClick={() => restoreConversation(item.email)}>Geri al</button></article>) : <p>Çöp kutusu boş.</p>}</section> : <section className="conversation-layout" aria-live="polite">{messageError && <p className="error">{messageError}</p>}{conversations.length > 0 && <><div className="conversation-tabs" role="tablist">{conversations.map((message) => { const unread = messages.some((item) => item.email === message.email && !item.readAt); const replyCount = replies.filter((reply) => reply.email === message.email).length; return <button className={selectedConversation === message.email ? 'active' : ''} type="button" onClick={() => openConversation(message.email)} key={message.email}><strong>{message.name}</strong><span>{message.email}</span><small>{unread ? 'Görüntülenmedi' : 'Görüntülendi'} · {replyCount} yanıt</small></button>; })}</div>{activeMessage && <div className="conversation-panel"><h2>{activeMessage.name}</h2><span>{activeMessage.email}</span><button className="button button-danger" type="button" onClick={() => deleteConversation(activeMessage.email)}>Mesajları sil</button><div className="conversation-history">{[...conversationMessages.map((message) => ({ ...message, direction: 'in' })), ...conversationReplies.map((reply) => ({ ...reply, direction: reply.direction || 'out' }))].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((item) => <article className={`conversation-message ${item.direction}`} key={`${item.direction}-${item.id}`}><span>{item.direction === 'in' ? 'Gelen mesaj' : 'Gönderilen yanıt'} · {new Date(item.createdAt).toLocaleString('tr-TR')}</span><p>{item.direction === 'in' ? (item.message || item.text) : item.text}</p></article>)}</div><form className="reply-box" onSubmit={(event) => sendReply(event, activeMessage)}><input required name="subject" defaultValue="Volkswagen talebiniz hakkında" /><textarea required name="text" rows="3" placeholder="Yanıtınızı yazın" /><button className="button button-primary" type="submit">E-posta ile yanıtla</button></form></div>}</>}</section>}</main>;
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [remoteImages, setRemoteImages] = useState({});
  useEffect(() => {
    fetch('/api/model-images').then((response) => response.ok ? response.json() : Promise.reject(new Error('Görsel servisi kullanılamıyor.'))).then((data) => setRemoteImages(data.images)).catch(() => {});
  }, []);
  useEffect(() => { const update = () => setPath(window.location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  const catalog = readCatalog().map((model) => ({ ...model, image: remoteImages[model.slug] || model.image }));
  const modelSlug = path.startsWith('/modeller/') ? path.split('/')[2] : null;
  const selectedModel = catalog.find((model) => model.slug === modelSlug);
  const page = path === '/admin' ? <Admin /> : selectedModel ? <ModelDetail model={selectedModel} /> : path === '/modeller' ? <Models models={catalog} /> : path === '/fiyatlar' ? <Prices models={catalog} /> : path === '/iletisim' ? <Contact /> : <Home models={catalog} />;
  return <><Seo path={path} /><Header currentPath={path} />{page}<footer className="footer"><div className="container footer-inner"><img src="/img/vwlogobeyaz.png" alt="Volkswagen" /><span>© 2026 Volkswagen Türkiye</span><span>Kalite. Güven. Teknoloji.</span><a href="/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>Yönetim</a></div></footer></>;
}

export default App;
