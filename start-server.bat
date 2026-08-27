@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Bagimliliklar kuruluyor...
  call npm.cmd install
)
if not exist .env (
  echo.
  echo UYARI: .env dosyasi bulunamadi. E-posta yanitlari icin proje klasorunde .env dosyasi olusturup SMTP bilgilerini doldurun.
  echo.
)
set ADMIN_USER=admin
set ADMIN_PASSWORD=123456
echo Volkswagen server http://localhost:3000 adresinde baslatiliyor...
call npm.cmd start
pause
