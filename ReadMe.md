# IECEP National

Website for the Institute of Electronics Engineers of the Philippines. React + Vite frontend, with a self-hosted Express + Prisma + PostgreSQL backend (see [`server/`](server/)) — no external platform dependency.

## Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Express, Prisma ORM, PostgreSQL
- **Auth**: JWT, email/password, role-based staff accounts (no public self-registration — accounts are created by an admin from the dashboard's Staff Access tab)
- **File uploads**: stored on local disk under `server/uploads/`, served statically by the API
- **Production serving**: after `npm run build` (repo root), the Express server also serves the built frontend from `dist/` directly — one Node process handles the API and the site, so only `server/` needs to run as a managed app

## Prerequisites

- **Node.js 18+** (LTS recommended) and npm
- **PostgreSQL 14+** — either:
  - A local instance (native install, or via Docker: `docker run -d --name iecep-postgres -e POSTGRES_USER=iecep -e POSTGRES_PASSWORD=<password> -e POSTGRES_DB=iecep -p 5432:5432 -v iecep_pgdata:/var/lib/postgresql/data postgres:16`), or
  - A managed Postgres (Neon, Supabase, Railway, RDS, etc.) for staging/production
- **git**

## Setup

1. Clone the repository and `cd` into it.
2. Install frontend dependencies from the project root:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   npm install --prefix server
   ```
4. Configure the backend environment — copy `server/.env.example` to `server/.env` and fill in real values:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/iecep"
   JWT_SECRET="a long random string"
   PORT=3001
   SEED_ADMIN_EMAIL="admin@yourdomain.com"
   SEED_ADMIN_PASSWORD="a strong password"
   ```
5. Run the database migration and seed the initial admin account + starting content:
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   cd ..
   ```

## Run Locally

Start both the frontend and API together from the project root:

```bash
npm run dev:all
```

This runs Vite (`npm run dev`) and the Express API (`npm run server`) concurrently. Open the frontend URL Vite prints (typically `http://localhost:5173`) — it proxies `/api` and `/uploads` requests to the API on port 3001.

To run them separately:

```bash
npm run dev      # frontend only
npm run server   # backend only
```

## Admin Access

Log in at `/admin/login` with the `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your `server/.env`. From there, use the **Staff Access** tab to create additional logins scoped to specific roles (e.g. a chapter coordinator who can only manage Chapter Corner content).

## Other Commands

```bash
npm run lint        # eslint
npm run typecheck   # tsc
npm run build        # production frontend build (outputs to dist/)
```

## Deployment Notes

- **Database**: point `DATABASE_URL` at your production Postgres instance and run `npx prisma migrate deploy` (not `migrate dev`) as part of your deploy process.
- **File uploads**: `server/uploads/` must live on **persistent disk** on your host — platforms with ephemeral/rebuilt filesystems (most serverless or container-per-deploy platforms) will lose uploaded files on every deploy or restart. A VPS or any host with a durable disk/volume works.
- **Secrets**: never commit `server/.env`. Set `JWT_SECRET`, `DATABASE_URL`, and `SEED_ADMIN_*` as environment variables on your host instead.
- **Build the frontend before deploying**: run `npm run build` from the repo root so `dist/` exists — the server serves 503 with a reminder message at `/` if it doesn't find a build yet.

### cPanel / CloudLinux Node.js Selector

This host type manages one Node process per configured "Application Root," and expects to own that directory's `node_modules` as a symlink into its own virtualenv — it does **not** understand a repo with two separate `package.json`s (root frontend + `server/` backend). Point it at the backend only:

- **Application root**: `server` (not the repo root)
- **Application startup file**: `src/index.js`
- Install dependencies via the app's **"Run NPM Install"** button in cPanel (not a raw `npm install --prefix server` from an unrelated app root — see below)
- Set `DATABASE_URL`, `JWT_SECRET`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` as environment variables on the app's configuration page
- From the app's activated shell (`server/` as cwd), run `npx prisma migrate deploy` then `npx prisma db seed` once
- Build the frontend separately — either locally and upload just the `dist/` folder, or over SSH from the repo root (`npm install && npm run build`) using the system Node, not the app's managed virtualenv — then restart the app so Express picks up `dist/`

If you see `Cloudlinux NodeJS Selector demands to store node modules for application in separate folder...`, the Application Root is set wrong (usually pointing at the repo root instead of `server`) or a real `node_modules` folder already exists where CloudLinux expects to place its managed symlink — remove it (`rm -rf node_modules` in that directory) and reconfigure the Application Root as above.
