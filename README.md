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
- `npm run start` — Runs the compiled production server from `dist/index.js`
- `npm run db:seed` — Runs initial database seed

---

## 📅 Maintenance & Release Log
- **2 November 2026:**
  - Automated API health check and latency monitoring on core database routes (`/api/health`, `/api/projects`).
  - Neon connection pooling metrics reviewed; verified high availability and zero memory leaks.
- **1 November 2026:**
  - Monthly database connection pooling health check and Neon compute resource audit.
  - API endpoint latency and JWT session validation verified. All services operational and synchronized with main branch.
- **31 October 2026:**
  - Neon PostgreSQL composite index synchronization on `Review`, `Comment`, and `CareerApplication`.
  - Schema parity alignment with client app for sequential scan mitigation and database egress optimization.
- **29 October 2026:**
  - Prisma client database bundle verification and synchronization.
  - Production readiness and system integration confirmed.

---

## 📅 Status & Audit Log
- **November 2, 2026:** System performance verified, connection metrics healthy & synchronized ✅
- **November 1, 2026:** Monthly audit complete, production ready & synchronized ✅
- **October 31, 2026:** Database indexes synced, production ready & bandwidth optimized ✅
- **October 25, 2026:** Live production readiness confirmed; main branch synchronized ✅
- **Database:** Neon PostgreSQL ORM with Direct & Pooled connection strings configured.
