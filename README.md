# faiyajjarif.github.io

Personal portfolio of **Faiyaj Jarif**: a React frontend on GitHub Pages, backed by a Spring Boot API.

```
faiyajjarif.github.io/
├── frontend/   React + Vite site  →  https://faiyajjarif.github.io
├── backend/    Spring Boot 3 API  →  hosted on Render (free)
├── .github/workflows/
│   ├── deploy-site.yml   builds + publishes the site on every push
│   └── backend-ci.yml    compiles + tests the API on every push
└── render.yaml           one-click Render setup for the API
```

**How the two parts fit:** GitHub Pages can only serve static files, so it hosts the React site. The Spring Boot API runs on Render. The site shows built-in data instantly and switches to live API data once it answers, so it never looks broken, even while the free server is asleep.

| Feature | Endpoint |
|---|---|
| Projects / skills / stats | `GET /api/projects`, `/api/skills`, `/api/stats` |
| Visitor counter | `POST /api/visits` (once per browser session) |
| Contact form (saved + optional email) | `POST /api/contact` (validated, rate-limited, honeypot) |
| Admin panel at `/#/admin` | `/api/admin/**` (HTTP Basic, BCrypt) |

---

## 1. Run it on your Mac

**Backend** (Java 21 + Maven):
```bash
cd backend
mvn test                 # runs the API tests
mvn spring-boot:run      # API on http://localhost:8080 (admin / change-me)
```

**Frontend** (Node 20+):
```bash
cd frontend
cp .env.example .env.local   # points the site at localhost:8080
npm install
npm run dev                  # http://localhost:5173  (admin: http://localhost:5173/#/admin)
```

## 2. Put the site live (free)

1. On GitHub, create a **public** repo named exactly **`faiyajjarif.github.io`**.
2. Push this folder to it:
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/faiyajjarif/faiyajjarif.github.io.git
   git push -u origin main
   ```
3. Repo **Settings → Pages → Source: GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy site" to go green. You're live at **https://faiyajjarif.github.io**.

At this point the site works fully on built-in data. The contact button opens an email instead of sending through the API.

## 3. Put the Spring Boot API live (free)

1. **Database (recommended):** create a free Postgres at [neon.tech](https://neon.tech). Copy its host, database, user and password. Without this, the API uses a file database that is wiped whenever Render restarts the server.
2. Go to [render.com](https://render.com), sign in with GitHub, choose **New → Blueprint**, and pick this repo. Render reads `render.yaml`.
3. When it asks for `ADMIN_PASSWORD`, enter a strong password for your admin panel. The first build takes a few minutes.
4. In the service's **Environment** tab, add your database and save. Render redeploys automatically.
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<neon-host>/<db>?sslmode=require`
   - `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`: from Neon
5. When it's deployed, open `https://<your-service>.onrender.com/api/projects`. You should see JSON.
6. Back on GitHub: **Settings → Secrets and variables → Actions → Variables → New variable**
   - Name `API_URL`, value `https://<your-service>.onrender.com`
7. **Actions → Deploy site → Run workflow**. The site now shows **API live** in the top bar, counts visitors, and the contact form and `/#/admin` work.

**Optional email alerts for contact messages:** in Render, add these environment variables (use a Gmail *App Password*, not your normal one):
`SPRING_MAIL_HOST=smtp.gmail.com`, `SPRING_MAIL_PORT=587`, `SPRING_MAIL_USERNAME=<gmail>`, `SPRING_MAIL_PASSWORD=<app password>`, `SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true`, `SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true`.
Messages are always saved in the admin panel either way.

> Render's free servers sleep after ~15 minutes without traffic and take up to a minute to wake up. The site handles this: it shows content immediately and the status pill reads "API waking up" until the server answers.

## 4. Editing content

- **Live:** go to `https://faiyajjarif.github.io/#/admin`, sign in, and edit projects and skills, or read messages.
- **Built-in copy** (shown before the API answers): `frontend/src/data/fallback.js`. Keep it roughly in sync with the admin data.
- **First-run seed data** for an empty database: `backend/.../seed/DataSeeder.java`.
- **RescueBot photo:** `frontend/public/rescuebot.jpg`.

## 5. Google

After the site is live, add it in [Google Search Console](https://search.google.com/search-console) and submit `https://faiyajjarif.github.io/sitemap.xml`. Link the site from your LinkedIn, GitHub and Facebook profiles. `index.html` already includes schema.org `Person` markup with `sameAs` links to those profiles.

**Custom domain later:** buy `faiyajjarif.com`, add it under **Settings → Pages → Custom domain**, then update the canonical/og URLs in `frontend/index.html`, `public/sitemap.xml`, `public/robots.txt`, and `CORS_ORIGINS` on Render.

## Preview before you deploy

On your Mac, in Terminal:
```bash
cd ~/Documents/Protfolio/faiyajjarif.github.io/frontend
npm install        # first time only
npm run dev        # open http://localhost:5173 in your browser
```
Edits to files in `src/` show up instantly. To preview the exact production build instead: `npm run build && npm run preview` (http://localhost:4173).
