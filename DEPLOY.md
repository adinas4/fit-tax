# Panduan Deploy ke Hostinger — FIT-TAX Cakrawala Sinergi

Dokumen ini menjelaskan langkah demi langkah cara meng-host website ini di
Hostinger. Ada dua opsi: **VPS (disarankan)** dan **Shared Hosting (alternatif)**.
Untuk pratinjau tampilan statis melalui GitHub Pages, lihat [GitHub Pages preview](#github-pages-preview).

---

## Daftar Isi
1. [Ringkasan teknologi](#1-ringkasan-teknologi)
2. [GitHub Pages preview](#github-pages-preview)
3. [Opsi A — VPS Hostinger (DISARANKAN)](#opsi-a--vps-hostinger-disarankan)
4. [Opsi B — Shared Hosting Hostinger (alternatif)](#opsi-b--shared-hosting-hostinger-alternatif)
5. [Konfigurasi domain & SSL](#konfigurasi-domain--ssl)
6. [Backup data](#backup-data)
7. [Update / redeploy](#update--redeploy)
8. [Troubleshooting](#troubleshooting)

---

## 1. Ringkasan teknologi

| Komponen | Detail |
|----------|--------|
| Framework | Next.js 16 (App Router), output **standalone** |
| Runtime | Node.js 20+ |
| Database | SQLite (file `db/custom.db`) via Prisma ORM |
| Process manager | PM2 (di VPS) |
| Upload gambar | folder persisten `uploads/`, disaji via route `/uploads/*` |
| Panel admin | `/admin` — login `admin@cakrawalaintiteknik.com` (ubah setelah deploy!) |

Karena memakai SQLite (file-based), database disimpan dalam satu file — **cukup
backup file `db/custom.db`** secara berkala. Tidak perlu MySQL/Redis.

> **Mengapa VPS disarankan?** Aplikasi Next.js adalah aplikasi Node.js yang
> berjalan terus-menerus (long-running). VPS Hostinger mendukung Node.js + PM2
> penuh. Shared Hosting Hostinger punya fitur Node.js terbatas (via Passenger)
> yang berfungsi tapi punya batasan memori & proses.

---

## GitHub Pages preview

Workflow `.github/workflows/github-pages-preview.yml` builds and publishes a
static preview at `https://adinas4.github.io/fit-tax/` after each push to
`main`. The source repository can remain private; the published preview is
public. GitHub Pages must be available for the repository's plan.

This is only a visual preview: admin pages, API routes, database-backed data,
and consultation form submission are not deployed. Public sample content is
used instead, and visitors are directed to contact the team through WhatsApp.
For a fully working website, deploy the application to a Node.js host using
the instructions below.

---

## Opsi A — VPS Hostinger (DISARANKAN)

### Langkah 1 — Siapkan VPS
1. Beli **VPS Hostinger** (plan KVM 1 vCPU / 4 GB RAM sudah cukup).
2. Pilih OS: **Ubuntu 22.04 LTS**.
3. Catat IP VPS dan password root.

### Langkah 2 — Install software di VPS
SSH ke VPS lalu jalankan:

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (process manager) + tsx (untuk menjalankan seed)
sudo npm install -g pm2 tsx

# nginx (reverse proxy) + git
sudo apt install -y nginx git

# (Opsional) bun — lebih cepat untuk install/build
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
```

Verifikasi: `node -v` → `v20.x.x`, `pm2 -v`, `nginx -v`.

### Langkah 3 — Upload kode ke VPS
**Cara 1 (git — disarankan):** push project ke GitHub/GitLab, lalu di VPS:
```bash
sudo mkdir -p /var/www/fittax
sudo chown $USER:$USER /var/www/fittax
cd /var/www/fittax
git clone https://github.com/USER/repo.git .
```

**Cara 2 (upload ZIP):** dari komputer lokal:
```bash
# Buat paket tanpa node_modules & .next (akan dibuat di server)
tar --exclude='node_modules' --exclude='.next' --exclude='dev.log' \
    -czf fittax.tar.gz -C /path/to/my-project .
# Upload via SFTP (FileZilla) ke /var/www/fittax, lalu di VPS:
cd /var/www/fittax && tar -xzf fittax.tar.gz && rm fittax.tar.gz
```

### Langkah 4 — Buat file `.env`
```bash
cd /var/www/fittax
cp .env.production.example .env
nano .env
```
Isi nilai sesuai server, contoh:
```ini
DATABASE_URL=file:/var/www/fittax/db/custom.db
NEXT_PUBLIC_SITE_URL=https://cakrawalaintiteknik.com
ADMIN_EMAIL=admin@cakrawalaintiteknik.com
ADMIN_PASSWORD=GantiPasswordKuat123!
UPLOADS_DIR=/var/www/fittax/uploads
PORT=3000
NODE_ENV=production
```
Simpan (`Ctrl+O`, `Enter`, `Ctrl+X`).

### Langkah 5 — Build & jalankan (otomatis)
```bash
cd /var/www/fittax
bash scripts/deploy.sh
```
Script ini otomatis: install dependency → generate Prisma → buat database →
seed konten + admin → build Next.js → start PM2.

Jika sukses, output akhir:
```
✓ Deployed. App running on port 3000.
```

Agar PM2 auto-start saat VPS reboot (sekali saja):
```bash
pm2 startup
# jalankan perintah yang ditampilkan pm2
pm2 save
```

### Langkah 6 — Konfigurasi nginx (reverse proxy)
```bash
sudo cp nginx.example.conf /etc/nginx/sites-available/fittax
sudo nano /etc/nginx/sites-available/fittax
# ganti "cakrawalaintiteknik.com" dengan domain Anda, aktifkan baris SSL nanti
sudo ln -s /etc/nginx/sites-available/fittax /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Lanjut ke [Konfigurasi domain & SSL](#konfigurasi-domain--ssl).

---

## Opsi B — Shared Hosting Hostinger (alternatif)

> Shared Hosting Hostinger punya fitur **Node.js** di hPanel → Advanced → Node.js.
> Batasan: Node versi terbatas, memori ~512 MB-1 GB, tidak ada PM2, restart
> otomatis via Passenger. **Cocok untuk traffic rendah.**

### Langkah 1 — Buat Node.js app di hPanel
1. Login hPanel → **Advanced** → **Node.js**.
2. Klik **Create Application**:
   - **Node.js version**: `20.x` (atau tertinggi yang tersedia)
   - **Application root**: `domains/namadomain.com/app`
   - **Application URL**: `https://namadomain.com`
   - **Application startup file**: `server.js`
3. Klik **Create**.

### Langkah 2 — Upload kode
1. Lewat **File Manager** hPanel, upload ZIP project (tanpa `node_modules`,
   `.next`, `db/*.db`) ke folder `domains/namadomain.com/app`.
2. Extract.

### Langkah 3 — Konfigurasi environment
1. Di hPanel Node.js → environment variables, tambahkan:
   - `DATABASE_URL` = `file:/home/uXXXXXXX/domains/namadomain.com/app/db/custom.db`
     (ganti `uXXXXXXX` dengan username hosting Anda — lihat di File Manager)
   - `NEXT_PUBLIC_SITE_URL` = `https://namadomain.com`
   - `ADMIN_EMAIL` = `admin@cakrawalaintiteknik.com`
   - `ADMIN_PASSWORD` = password kuat Anda
   - `UPLOADS_DIR` = `/home/uXXXXXXX/domains/namadomain.com/app/uploads`
   - `NODE_ENV` = `production`
2. Atau buat file `.env` manual via File Manager dengan isi yang sama
   (gunakan template `.env.production.example`).

### Langkah 4 — Build (jalankan via SSH atau terminal hPanel)
hPanel → **Advanced** → **Terminal** (atau SSH ke shared hosting):
```bash
cd ~/domains/namadomain.com/app
npm install
npx prisma generate
npx prisma db push --accept-data-loss
npm run db:seed        # atau: npx tsx scripts/seed.ts
npm run build
```

### Langkah 5 — Start
Kembali ke hPanel → Node.js → klik **Run NPM Install** (jika belum) →
**Restart** aplikasi. Passenger otomatis menjalankan `server.js`.

> **Catatan build di shared hosting:** memori terbatas bisa membuat `next build`
> gagal (OOM). Jika terjadi, **build di komputer lokal** lalu upload folder
> `.next/standalone` + `.next/static` + `public` ke server. Set `NODE_ENV=production`
> dan jalankan `node server.js` sebagai startup.

---

## Konfigurasi domain & SSL

1. **Arahkan domain ke Hostinger:**
   - VPS: di registrar domain, set **A record** → IP VPS Anda.
   - Shared: otomatis ketika domain ditambahkan di hPanel.
2. **Aktifkan SSL (HTTPS):**
   - hPanel → **Security** → **SSL** → aktifkan **Auto-SSL** (gratis).
   - VPS dengan Let's Encrypt: `sudo certbot --nginx -d cakrawalaintiteknik.com -d www.cakrawalaintiteknik.com`
3. Update `NEXT_PUBLIC_SITE_URL` di `.env` ke `https://namadomain.com`, lalu
   restart app (`pm2 restart fittax` di VPS, atau Restart di hPanel).

---

## Backup data

Dua hal yang HARUS dibackup secara berkala:

1. **Database** — file `db/custom.db` (berisi semua konten: konsultasi,
   layanan, artikel, tim, admin, pengaturan).
2. **Upload gambar** — folder `uploads/` (foto tim, dll).

Script backup sederhana (jalankan di VPS, bisa via cron harian):
```bash
cd /var/www/fittax
tar -czf backups/fittax-$(date +%F).tar.gz db/custom.db uploads/
# hapus backup lebih dari 30 hari:
find backups/ -name "fittax-*.tar.gz" -mtime +30 -delete
```
Tambahkan ke crontab: `0 3 * * * cd /var/www/fittax && ./scripts/backup.sh`
(buat `scripts/backup.sh` berisi perintah di atas).

> **Penting:** `db/custom.db` tidak ter-commit ke git (di-gitignore). Jangan
> andalkan git untuk backup database.

---

## Update / redeploy

Setelah mengubah kode (atau pull update terbaru):

**VPS:**
```bash
cd /var/www/fittax
git pull origin main          # atau upload ulang file yang berubah
bash scripts/deploy.sh        # rebuild + restart PM2
```
Script `deploy.sh` bersifat idempoten — aman dijalankan berulang. Data database
dan upload **tidak terhapus** saat redeploy.

**Shared Hosting:**
1. Upload file yang berubah via File Manager.
2. Di terminal hPanel: `npm install && npm run build`.
3. Restart aplikasi Node.js di hPanel.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Error: Query engine library not found` | Jalankan `npx prisma generate` lalu rebuild. Pastikan `node_modules/.prisma` ter-copy ke standalone (sudah otomatis di `npm run build`). |
| Halaman blank / 500 di production | Cek log: `pm2 logs fittax --lines 100` (VPS) atau file log di hPanel. Umumnya: `DATABASE_URL` salah path, atau `.env` belum dibuat. |
| Tidak bisa login admin | Pastikan seed sudah dijalankan. Reset password: set `RESET_ADMIN=1` + `ADMIN_PASSWORD=baru` di `.env`, lalu `bun run scripts/seed.ts`, lalu hapus `RESET_ADMIN`. |
| Gambar upload tidak muncul | Pastikan folder `UPLOADS_DIR` ada & writable (`chmod -R 755 uploads/`). Cek route `/uploads/...` di log. |
| Port 3000 sudah dipakai | Ubah `PORT` di `.env` (mis. `3001`) dan update `proxy_pass` di nginx. |
| SSL tidak aktif | hPanel → SSL → Force HTTPS. VPS: jalankan `certbot --nginx`. |
| Build OOM di shared hosting | Build di lokal, upload `.next/standalone` saja. |

---

## Checklist akhir sebelum live

- [ ] `.env` terisi dengan password admin yang KUAT (bukan `admin123`)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://domain-anda.com`
- [ ] SSL/HTTPS aktif dan redirect HTTP→HTTPS berfungsi
- [ ] Buka `https://domain-anda.com` — website tampil normal
- [ ] Buka `https://domain-anda.com/admin` — bisa login dengan password baru
- [ ] Backup pertama `db/custom.db` + `uploads/` dibuat
- [ ] (VPS) `pm2 startup` + `pm2 save` dijalankan agar auto-restart saat reboot

---

Jika butuh bantuan lebih lanjut, cek log terlebih dahulu:
- **VPS:** `pm2 logs fittax --lines 100`
- **Shared:** hPanel → Node.js → **View Logs**
