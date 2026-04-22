# Deployment Guide — Aparthotel Jardin Tropical (VPS + FileZilla)

This project is a Next.js 14 (App Router) app with a Prisma + MySQL backend.
Below is the simplest reliable deploy flow using **FileZilla** for upload and **PM2** for process management.

---

## 1. Build locally (Windows)

Run in the project root (`c:\wamp64\www\jardin-tropical`):

```powershell
# 1. Install deps (skip if already done)
npm install

# 2. Build the standalone bundle
npm run build
```

After build you will have:

- `.next/standalone/`      ← self-contained Node server (`server.js` inside)
- `.next/static/`          ← compiled JS/CSS (must sit next to standalone)
- `public/`                ← static assets (images, favicon, etc.)
- `prisma/`                ← schema + seed
- `package.json`, `package-lock.json`
- `.env.example`           ← template for production env

---

## 2. What to upload via FileZilla

Connect to your VPS (SFTP, port 22) and upload the following to your target directory, e.g. `/var/www/jardin-tropical`:

| Local source                  | Remote destination                                  |
|-------------------------------|-----------------------------------------------------|
| `.next/standalone/*`          | `/var/www/jardin-tropical/`                         |
| `.next/static/`               | `/var/www/jardin-tropical/.next/static/`            |
| `public/`                     | `/var/www/jardin-tropical/public/`                  |
| `prisma/`                     | `/var/www/jardin-tropical/prisma/`                  |
| `package.json`                | `/var/www/jardin-tropical/package.json`             |
| `package-lock.json`           | `/var/www/jardin-tropical/package-lock.json`        |
| `ecosystem.config.js`         | `/var/www/jardin-tropical/ecosystem.config.js`      |
| `.env.example`                | `/var/www/jardin-tropical/.env.example`             |

> **Do NOT upload**: `node_modules/`, `.next/cache/`, `.env` (create it on the server), `.git/`.

> **Note**: `.next/standalone/` already contains a trimmed `node_modules` with only the runtime dependencies, so you do not need to upload your local `node_modules`.

### FileZilla tips
- Use **Transfer → Transfer type → Binary** to avoid line-ending issues.
- Right-click the local files → **Upload** to drop them in the current remote directory.
- If you re-deploy, replace `.next/static/`, the `standalone` files, and `public/` then restart PM2 (see step 5).

---

## 3. VPS prerequisites (run once via SSH)

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 (process manager) and pnpm/npm (npm is bundled)
sudo npm install -g pm2

# MySQL 8 (or use an existing instance)
sudo apt-get install -y mysql-server
sudo mysql_secure_installation
```

### Create the database + user

```bash
sudo mysql
```
```sql
CREATE DATABASE jardin_tropical CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jardin_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON jardin_tropical.* TO 'jardin_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. First-time setup on the VPS

```bash
cd /var/www/jardin-tropical

# Create production env from the template
cp .env.example .env
nano .env       # fill DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_*

# Install only what is needed for prisma + seed (standalone already bundled the rest)
npm install --omit=dev prisma @prisma/client tsx

# Push schema + seed initial admin/rooms
npx prisma db push
npx tsx prisma/seed.ts
```

> Generate a strong secret with: `openssl rand -hex 32`

---

## 5. Run the app with PM2

```bash
cd /var/www/jardin-tropical
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # follow the printed command to enable auto-start on reboot
```

Useful commands:

```bash
pm2 status
pm2 logs jardin-tropical
pm2 restart jardin-tropical
pm2 stop jardin-tropical
```

---

## 6. Nginx reverse proxy + HTTPS

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/jardin-tropical`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable + issue TLS cert:

```bash
sudo ln -s /etc/nginx/sites-available/jardin-tropical /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Your site will now be available at https://yourdomain.com.

---

## 7. Re-deploying after code changes

On Windows:

```powershell
npm run build
```

Then upload via FileZilla (replace contents):

- `.next/standalone/*`  →  `/var/www/jardin-tropical/`
- `.next/static/`       →  `/var/www/jardin-tropical/.next/static/`
- `public/`             →  `/var/www/jardin-tropical/public/`
- (only if Prisma schema changed) `prisma/`

Then on the VPS:

```bash
cd /var/www/jardin-tropical
# only if schema changed:
npx prisma db push

pm2 restart jardin-tropical
```

---

## 8. After first login

Sign in at `https://yourdomain.com/admin/login` with the credentials in your `.env`,
then immediately change the admin password from the admin panel (or by re-seeding with new env values).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| 502 Bad Gateway | `pm2 logs jardin-tropical` — usually a missing env var or DB unreachable |
| Images don't load | Make sure `public/` is uploaded next to `server.js` |
| `Prisma Client not generated` | Ensure `prisma/schema.prisma` is uploaded and run `npx prisma generate` |
| Wrong hostname / mixed content | Set `NEXTAUTH_URL=https://yourdomain.com` and restart PM2 |
| Port already in use | Change `PORT` in `ecosystem.config.js` and reload Nginx upstream |
