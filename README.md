# StockPilot

A full-stack inventory management application built with Next.js, TypeScript, and MongoDB, featuring session-based authentication, complete product/category CRUD with search and filtering, an AI-powered inventory query assistant, and real-time dashboard analytics.

**Live demo:** https://stockpilot-project.vercel.app

---

## Overview

Track products across categories, monitor stock against configurable low-stock thresholds, and get instant answers about inventory state through a natural-language AI assistant.

Authentication is session-based — all accounts currently share a single role (see Known Limitations).

---

## Features

- **Authentication** — Email/password auth via NextAuth.js v5 (JWT strategy), with Edge-safe middleware route protection and bcrypt password hashing. All authenticated users currently share the same access level; see Known Limitations.
- **Product & Category CRUD** — Full create/read/update/delete for both entities, with category-to-product referential integrity (a category can't be deleted while products still reference it).
- **Search & filtering** — Server-side search by product name/SKU and category filtering, implemented via URL query parameters and a MongoDB `$regex` query — no client-side JavaScript required.
- **Consistent API error handling** — Every mutation route differentiates validation errors (400), duplicate keys (409), not-found (404), and unexpected failures (500) — verified against real HTTP requests, not assumed.
- **AI Inventory Assistant** — Ask natural-language questions about your inventory ("which category has the most low-stock items?") powered by Google's Gemini API. Deliberately scoped to answer only from real inventory data — it will honestly decline questions requiring data the schema doesn't track (e.g. sales velocity, demand forecasting) rather than fabricate an answer.
- **Dashboard analytics** — Total products, total categories, low-stock count, and total inventory value, computed via MongoDB aggregation pipelines rather than in-application calculation.
- **Low-stock detection** — Computed dynamically per product against its own configurable threshold, not a hardcoded global value.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), full-stack — no separate backend server |
| Language | TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth.js v5 (JWT), bcryptjs |
| AI | Google Gemini API |
| Styling | Tailwind CSS |
| Deployment | Vercel |

**Why Next.js full-stack instead of a separate Express API:** avoids duplicating auth/session logic across two servers and simplifies deployment to a single Vercel project, at the cost of tighter coupling between frontend and backend than a fully decoupled architecture would have.

---

## Architecture

```
Browser
   ├── Server Components (dashboard, edit pages) → Mongoose, direct
   ├── Client Components (forms, deletes, AI box) → API Routes
   ▼
API Routes (app/api/**) — session check → Mongoose → revalidatePath()
   ▼
MongoDB Atlas
```

Server Components fetch data directly on page load (faster, no network hop). Client-driven actions — form submits, deletes, AI queries — go through API routes, which check the session and call `revalidatePath()` after mutations to keep cached pages in sync.

Other decisions:
- **Prices stored as integer cents**, converted to rupees only at the UI layer, to avoid floating-point rounding errors.
- **AI feature uses context-stuffing**, not function-calling — the full inventory dataset is passed into the prompt directly. Simple and accurate at this scale; would need a retrieval-based approach if inventory grew much larger.

---

## Project Structure

```
stockpilot/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   └── register/route.ts         # Signup
│   │   ├── categories/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   └── [id]/route.ts             # GET, PATCH, DELETE
│   │   ├── products/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   └── [id]/route.ts             # GET, PATCH, DELETE
│   │   ├── ai-query/route.ts             # AI assistant endpoint
│   │   └── dashboard-stats/route.ts      # Aggregation endpoint
│   ├── dashboard/
│   │   ├── layout.tsx                    # Shared nav, applies to all dashboard pages
│   │   ├── page.tsx                      # Overview (stats + AI assistant)
│   │   ├── StatsCards.tsx
│   │   ├── AiQueryBox.tsx
│   │   ├── DeleteButton.tsx              # Shared across products/categories
│   │   ├── products/
│   │   │   ├── page.tsx                  # List, search, filter
│   │   │   ├── new
│   │   │   │   ├── page.tsx
│   │   │   │   └── ProductForm.tsx
│   │   │   └── [id]/edit/
│   │   │       ├── page.tsx
│   │   │       └── EditProductForm.tsx
│   │   └── categories/
│   │       ├── page.tsx
│   │       ├── CategoryForm.tsx
│   │       └── [id]/edit/EditCategoryForm.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── layout.tsx
│   ├── providers.tsx
│   └── page.tsx                          # Homepage
├── models/
│   ├── Product.ts
│   └── Category.ts
│   ├── User.ts
├── lib/
│   ├── mongodb.ts                        # Connection + model registration
│   └── constants/categoryColors.ts
├── types/
│   └── next-auth.d.ts                    # Session/role type extensions
├── auth.ts                               # Full NextAuth config
├── auth.config.ts                        # Edge-safe subset (used by middleware)
├── next.config.ts
└── middleware.ts                         # Route protection
```

**`auth.ts` / `auth.config.ts` split:** Edge middleware can't use Node-only packages like `bcryptjs`, so `auth.config.ts` holds the Edge-safe subset used by middleware, while `auth.ts` holds the full config used everywhere else.

---

## Installation

```bash
git clone https://github.com/jahnavisoni29/stockpilot.git
cd stockpilot
npm install
```

Create a `.env.local` file with:

```
MONGODB_URI=your_mongodb_atlas_connection_string
AUTH_SECRET=your_auth_secret
GEMINI_API=your_google_gemini_api_key
```

Run the dev server:

```bash
npm run dev
```

---

## Known Limitations

Being upfront about what's not built, rather than implying it is:

- **No real role-based access control.** The schema supports `"admin" | "staff"` roles, but registration currently hardcodes every new account to `"admin"`. A real implementation would require either a role-selection flow with appropriate guardrails, or an admin-only invite/promotion system — scoped out given the project timeline.
- **No automated test suite.** All functionality was verified manually against real HTTP requests and live UI testing throughout development, not via an automated test framework.
- **No CI/CD pipeline.** Type-checking and manual verification were performed locally before every push; not yet automated via GitHub Actions.
- **No data visualization library.** Dashboard stats are shown as numeric cards rather than charts.

---

## Future Enhancements

- Real role-based permissions with an admin-managed user system
- Automated tests (unit tests for API route error handling, integration tests for auth flows)
- GitHub Actions CI pipeline for type-checking and tests on every push
- Data visualization (Recharts) for dashboard trends
- Function-calling or retrieval-based approach for the AI assistant if inventory scale grew significantly