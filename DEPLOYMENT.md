# Deployment Guide — Aparthotel Jardin Tropical (Hostinger VPS from GitHub)

This project is a Next.js 14 (App Router) app with a Prisma + MySQL backend.
Deploy directly on a **Hostinger VPS** by pulling the repository from GitHub:
<https://github.com/iamnadavjunior/jardin-tropical>

---

## 1. Hostinger VPS prerequisites (run once via SSH)

Order a Hostinger VPS plan with **Ubuntu 22.04** (or use the Hostinger "Node.js" template), then SSH in as `root` (or your sudo user).

```bash
# System updates
apt-get update && apt-get upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git build-essential

# PM2 process manager
npm install -g pm2

# MySQL 8 server
apt-get install -y mysql-server
mysql_secure_installation
```

### Create the database + user

```bash
mysql
```
```sql
CREATE DATABASE jardin_tropical CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'jardin_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON jardin_tropical.* TO 'jardin_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 2. Clone the project from GitHub

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/iamnadavjunior/jardin-tropical.git
cd jardin-tropical
```

> If the repo ever becomes private, generate a Personal Access Token on GitHub and use:
> `git clone https://USERNAME:TOKEN@github.com/iamnadavjunior/jardin-tropical.git`

---

## 3. Configure environment

```bash
cp .env.example .env
nano .env
```

Fill in:

```
DATABASE_URL="mysql://jardin_user:STRONG_PASSWORD_HERE@localhost:3306/jardin_tropical"
NEXTAUTH_SECRET="$(openssl rand -hex 32)"
NEXTAUTH_URL="https://yourdomain.com"
ADMIN_EMAIL="admin@jardintropical.com"
ADMIN_PASSWORD="your-strong-admin-password"
NODE_ENV="production"
PORT=3000
HOSTNAME="0.0.0.0"
```

> Generate a fresh secret with: `openssl rand -hex 32`

---

## 4. Install, migrate, build

```bash
# Install dependencies (postinstall runs prisma generate automatically)
npm install

# Push schema to MySQL and seed initial admin + rooms
npx prisma db push
npx tsx prisma/seed.ts

# Production build
npm run build
```

---

## 5. Start with PM2

```bash
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
apt-get install -y nginx certbot python3-certbot-nginx
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

Enable + issue TLS certificate:

```bash
ln -s /etc/nginx/sites-available/jardin-tropical /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Point your domain's **A record** to your Hostinger VPS IP first (in Hostinger DNS settings or your registrar).

The site will be live at https://yourdomain.com.

---

## 7. Re-deploying after code changes

Push your changes to GitHub from your local machine:

```powershell
git add -A
git commit -m "your message"
git push origin main
```

Then on the VPS:

```bash
cd /var/www/jardin-tropical
git pull origin main
npm install                 # if dependencies changed
npx prisma db push          # only if prisma/schema.prisma changed
npm run build
pm2 restart jardin-tropical
```

A one-liner you can save as `deploy.sh` on the server:

```bash
#!/usr/bin/env bash
set -e
cd /var/www/jardin-tropical
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart jardin-tropical
```

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 8. After first login

Sign in at `https://yourdomain.com/admin/login` with the credentials in your `.env`,
then change the admin password from the admin panel.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| 502 Bad Gateway | `pm2 logs jardin-tropical` — usually a missing env var or DB unreachable |
| Images don't load | Ensure `public/` exists in the project root on the server |
| `Prisma Client not generated` | `npx prisma generate` then `pm2 restart jardin-tropical` |
| Wrong hostname / mixed content | Set `NEXTAUTH_URL=https://yourdomain.com` and `pm2 restart jardin-tropical` |
| Port already in use | Change `PORT` in `ecosystem.config.js` and update Nginx upstream |
| `git pull` rejects | Stash or commit local changes on the server: `git stash && git pull && git stash pop` |
