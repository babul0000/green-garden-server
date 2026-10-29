# 🌿 AR Green Garden Server — Backend API

Backend API service for AR Green Garden landscaping and architectural platform. Built with Express, TypeScript, and Prisma ORM connecting to Neon PostgreSQL.

---

## 🛠️ Tech Stack
- **Runtime:** Node.js, Express 4.x
- **Language:** TypeScript
- **Database & ORM:** PostgreSQL (Neon Cloud) + Prisma ORM 6
- **Authentication:** JWT (JSON Web Tokens) with Cookie & Bearer support
- **Validation:** Zod schemas

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Ensure your `.env` contains:
```env
DATABASE_URL="your-neon-postgres-connection-string"
DIRECT_URL="your-neon-direct-postgres-connection-string"
JWT_SECRET="your-jwt-secret-key"
PORT=5000
```

### 3. Database Migration & Seeding
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 📦 Scripts
- `npm run dev` — Starts dev server with `tsx watch`
- `npm run build` — Generates Prisma client and compiles TypeScript to `dist/`

---

## 📅 Maintenance & Release Log
- **29 October 2026:**
  - Prisma client database bundle verification and synchronization.
  - Production readiness and system integration confirmed.
- `npm run start` — Runs the compiled production server from `dist/index.js`
- `npm run db:seed` — Runs initial database seed

---

## 📅 Status & Audit Log
- **October 21, 2026:** Verified & Production Ready ✅
- **October 22, 2026:** Validated database connection pooling parameters & error handling.
- **October 23, 2026:** Health probe `/api/health` connectivity and latency audit confirmed.
- **October 24, 2026:** Validated JWT cookie and Bearer session revocation resilience.
- **October 25, 2026:** Live production readiness confirmed; main branch synchronized ✅
- **Database:** Neon PostgreSQL ORM with Direct & Pooled connection strings configured.


