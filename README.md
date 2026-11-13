# ⚡ OmniList AI — Multi-Channel E-Commerce Inventory & Listing Engine

> **The Next-Gen Command Center for Cross-Border E-Commerce:** From barcode scan to live multi-channel listings on eBay, Shopify, and Amazon in under 30 seconds using Google Gemini AI.

---

## 📌 Executive Summary

**OmniList AI** is a full-stack, enterprise-grade e-commerce automation platform built to eliminate the tedious manual work of cataloging, copywriting, SEO optimization, and publishing inventory across multiple marketplaces.

By unifying barcode scanning (UPC/EAN), multi-model AI listing generation, and direct marketplace API integrations (eBay Inventory API & Shopify Admin GraphQL/REST), OmniList enables solo sellers, brand owners, and high-volume cross-border exporters to manage and sync their catalog from a single command center.

* **Live Production URL:** [https://mediumslateblue-dinosaur-388048.hostingersite.com](https://mediumslateblue-dinosaur-388048.hostingersite.com)
* **Repository:** `mujeebabdul-99/omnilist-ai` (Branch: `main`)
* **Primary Stack:** Next.js 15 (App Router), React 19, TypeScript, Hostinger Cloud MySQL, Prisma ORM, Google Gemini AI, jose (Edge JWT), TanStack React Query v5.

---

## 🏗️ Technical Architecture & Stack

```
                              ┌────────────────────────────────────────┐
                              │            Client Browser              │
                              │  (React 19 / TanStack Query v5 / CSS)  │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 ▼
                              ┌────────────────────────────────────────┐
                              │        Next.js 15 App Router           │
                              │  Edge Middleware (JWT Session Auth)    │
                              └──────────────────┬─────────────────────┘
                                                 │
                  ┌──────────────────────────────┼──────────────────────────────┐
                  ▼                              ▼                              ▼
      ┌───────────────────────┐      ┌───────────────────────┐      ┌───────────────────────┐
      │   Auth & Management   │      │   AI Engine & Catalog │      │ Marketplace Pipelines │
      │  /api/auth/*          │      │  /api/ai/*            │      │  /api/ebay/*          │
      │  /api/dashboard/stats │      │  /api/products/*      │      │  /api/shopify/*       │
      │  /api/integrations    │      │  /api/upc/lookup      │      │  /api/listings/*      │
      └───────────┬───────────┘      └───────────┬───────────┘      └───────────┬───────────┘
                  │                              │                              │
                  │                              │   ┌──────────────────────────┘
                  ▼                              ▼   ▼
      ┌───────────────────────────────────────────────────────┐
      │               Hostinger Cloud MySQL 8                 │
      │   Prisma ORM with Automatic URL-Encoding Sanitizer    │
      └───────────────────────────────────────────────────────┘
```

### 1. Frontend
* **Framework:** Next.js 15.5+ App Router with React 19.
* **Design System:** Custom dark futuristic command-center theme with pure inline React styles (`#080B0E`, `#0D1117`, with `#C5E756` neon lime accents). Zero runtime CSS-in-JS overhead; zero Tailwind class conflicts.
* **State Management:** `@tanstack/react-query` v5 for resilient server-state caching, automatic cache invalidation (`dashboard-stats`, `auth-me`, `products`, `listings`), and background synchronization.
* **Barcode Scanner:** Real-time camera barcode decoder supporting UPC-A, EAN-13, and Code 128 formats via native camera stream.

### 2. Backend & Security
* **Authentication:** Edge-compatible JWT authentication using `jose` with `HS256` signatures, `bcryptjs` password hashing (cost factor 12), and secure `omnilist_session` HTTP-only cookies (`SameSite=Lax`, `Path=/`, 7-day TTL).
* **Route Protection:** Next.js Middleware (`src/middleware.ts`) intercepting all protected page and API requests. Automatically routes authenticated users away from `/login` and unauthenticated users into the login flow.
* **Database & ORM:** Hostinger Cloud MySQL running on dedicated port 3306 with Prisma ORM 5.22. Includes a custom connection sanitizer (`src/lib/prisma.ts`) that automatically handles special characters (`#`, `!`) via percent-encoding (`%23`, `%21`) to prevent URI fragment parser corruption.

### 3. Integrations & External Services
* **AI Engine:** Google Gemini AI (`@google/genai`) generating marketplace-tailored titles (under 80 characters for eBay), benefit-driven bullet points, rich HTML descriptions, and category taxonomy.
* **eBay API:** Full OAuth 2.0 Authorization Code flow with automatic refresh token rotation. Integrates with the modern **eBay Inventory API** (`/sell/inventory/v1/inventory_item` and `/sell/inventory/v1/offer`) to publish live offers.
* **Shopify API:** Multi-store Admin API integration for automated product creation, inventory tracking, and variant publishing.
* **Barcode Metadata:** UPCitemdb / Open Food Facts API integration for instant product title, brand, and image resolution from raw 12-digit barcodes.

---

## 📊 Database Schema (Prisma ORM)

```prisma
model User {
  id                  String                 @id @default(cuid())
  email               String                 @unique
  name                String?
  passwordHash        String
  ebayAccessToken     String?                @db.Text
  ebayRefreshToken    String?                @db.Text
  ebayTokenExpiresAt  DateTime?
  ebayConnectedAs     String?
  shopifyAccessToken  String?                @db.Text
  shopifyShopDomain   String?
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt
  products            Product[]
  listings            Listing[]
  jobs                Job[]
}

model Product {
  id                  String                 @id @default(cuid())
  userId              String
  title               String
  description         String?                @db.Text
  brand               String?
  upc                 String?                @unique
  sku                 String?                @unique
  costPrice           Decimal?               @db.Decimal(10, 2)
  targetPrice         Decimal?               @db.Decimal(10, 2)
  quantity            Int                    @default(1)
  weight              Decimal?               @db.Decimal(8, 2)
  dimensions          Json?                  // { length, width, height, unit }
  images              Json?                  // Array of image URLs
  category            String?
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt
  user                User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  listings            Listing[]
}

model Listing {
  id                  String                 @id @default(cuid())
  userId              String
  productId           String
  platform            Platform               // EBAY, SHOPIFY, AMAZON, WALMART
  status              ListingStatus          // DRAFT, OPTIMIZED, QUEUED, LIVE, ENDED, ERROR
  externalId          String?                // eBay Offer ID / Shopify Product ID
  liveUrl             String?
  title               String
  description         String?                @db.Text
  price               Decimal                @db.Decimal(10, 2)
  quantity            Int                    @default(1)
  images              Json?
  errorMessage        String?                @db.Text
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt
  user                User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  product             Product                @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Job {
  id                  String                 @id @default(cuid())
  userId              String
  type                JobType                // LISTING_PUBLISH, INVENTORY_SYNC, AI_OPTIMIZE
  status              JobStatus              // PENDING, PROCESSING, COMPLETED, FAILED
  payload             Json?
  result              Json?
  retryCount          Int                    @default(0)
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt
  user                User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## ✅ Progress Tracker (What Has Been Completed)

### 1. Core Platform & User System
- [x] **Authentication Flow:** Secure Registration (`/register`) and Login (`/login`) with `bcryptjs` password hashing and `jose` JWT cookies.
- [x] **Hard Navigation & Cookie Sync:** Switched auth redirect to full document navigation (`window.location.href = "/"`) to ensure the HTTP-only cookie is immediately sent in request headers without requiring manual page reload.
- [x] **Dynamic Settings Page:** Real user identity (`user.name`, `user.email`, `user.id`, initials avatar) wired directly to `/api/auth/me`. Replaced all static placeholder data.
- [x] **Session Sign-Out:** Clean logout button in both the Account Settings tab and collapsible sidebar, invalidating cache and redirecting to `/login`.
- [x] **Protected Middleware:** Next.js 15 edge middleware guarding `/`, `/products`, `/listings`, `/analytics`, `/settings`, and `/api/*`.

### 2. Barcode Scanning & AI Optimization
- [x] **Camera Barcode Scanner:** Real-time video barcode stream decoding UPC-A, EAN-13, and Code 128.
- [x] **UPC Metadata Resolution:** Queries UPCitemdb and Open Food Facts with automatic fallbacks for title, brand, and images.
- [x] **Gemini AI Listing Engine:** Custom prompt engineering delivering channel-specific titles (eBay 80-char limit), SEO keywords, bullet points, and clean HTML descriptions.
- [x] **Draft Panel Component:** Interactive slider for AI temperature, title/description overrides, price targets, and multi-image reordering.

### 3. Listing Approval & Marketplace Publishing
- [x] **Approve & Queue Pipeline:** "Approve & Queue" button persists drafts into MySQL, creates an asynchronous `Job` record with status `PENDING`, and triggers real-time React Query cache invalidation across the app.
- [x] **eBay Inventory API Engine (`src/lib/ebay/inventory.ts`):**
  - Creates/updates inventory items (`PUT /sell/inventory/v1/inventory_item/{sku}`).
  - Formats multi-image arrays and eBay-compliant aspect maps.
  - Automatically provisions or updates listing offers (`POST /sell/inventory/v1/offer`).
  - Publishes live offers (`POST /sell/inventory/v1/offer/{offerId}/publish/`) and captures the live eBay Item ID and URL.
  - Auto-refreshes expired OAuth tokens on-the-fly using stored refresh tokens.
- [x] **Shopify Admin Integration:** OAuth and Private App token exchange, pushing products directly to Shopify Admin with image syncing and inventory tracking.
- [x] **Listings Page (`/listings`):** Real-time listing table with dynamic status pills (`DRAFT`, `QUEUED`, `LIVE`), live filters (All, eBay, Shopify, Live, Queued), and action buttons (**Publish Now**, **End Listing**, **Delete**).

### 4. Cross-Border Legal & Seller Compliance Guide
- [x] **Pakistan Seller Playbook (`PAKISTAN_SELLER_AND_LEGAL_GUIDE.md`):** Complete guide detailing:
  - eBay CBT (Cross-Border Trade) via Payoneer.
  - State Bank of Pakistan (SBP) **FE Circular No. 04 of 2020** (exempting B2C e-commerce courier exports up to \$5,000 from advance Form-E).
  - FBR NTN registration, income tax reduction under Section 154A, and e-PRC generation.
  - US LLC / UK LTD foreign entity formation for enterprise scale.
  - 100% free Sandbox auth testing without needing a live seller account.

---

## 📋 Upcoming Roadmap & Feature Tasks

### 1. Ephemeral Real-Time Store Stats (Zero-Bloat Dashboard Metrics)
- [ ] **Live Marketplace Aggregator:** Build `/api/analytics/live` endpoint to query connected marketplace APIs directly.
- [ ] **Shopify Metrics:** Query Shopify Admin API for live product counts and recent order metrics.
- [ ] **eBay Active Counts:** Query eBay Inventory API (`/sell/inventory/v1/inventory_item?limit=1`) to get live total counts without polling heavy datasets.
- [ ] **Browser-Only Caching:** Store metrics in TanStack React Query (`staleTime: 10 * 60 * 1000`) on the client to completely avoid MySQL database bloat and stale metric logging.

### 2. The "Cold-Start Importer" (One-Click Platform Sync)
- [ ] **Catalog Extraction:** Pull existing active listings via eBay Inventory API (`GET /sell/inventory/v1/inventory_item`).
- [ ] **Gemini Cleansing Pipeline:** Prompt engineering to strip eBay-specific jargon (auction terms, feedback requests, return disclaimers) and reformat into modern, high-converting DTC HTML with clean bullet points.
- [ ] **Batch Processing & Job Queue:** Utilize the existing MySQL `Job` model (`COLD_START_SYNC`) to process catalogs in asynchronous chunks (5–10 items per batch) with live UI progress tracking to prevent HTTP gateway timeouts.
- [ ] **Direct Shopify Push:** Map eBay-hosted images (`i.ebayimg.com`) directly into Shopify Admin API without intermediate server storage, instantly creating Shopify products and variants.
- [ ] **Sandbox Validation:** Verify end-to-end sync using eBay Sandbox developer accounts before live commercial store migration.

### 3. Dimensional Weight & Automated Shipping Margin Engine
- [ ] **Volumetric Weight Formula:** Automatically calculate `(L x W x H in cm) / 5000` vs actual weight to determine true courier billing weight (DHL/FedEx).
- [ ] **Net Profit Calculator:** Automatically factor in eBay commission (~13.25% + $0.30), Payoneer FX conversion (~1.5%), and international courier fees to suggest profitable target prices.

### 4. Competitive Repricing & Team Workspace Access
- [ ] **Competitor Pricing Radar:** Track Buy Box and lowest market prices via barcode matching.
- [ ] **Multi-User Workspaces:** Organization-level permissions (`OWNER`, `MANAGER`, `LISTER`).

---

## 📡 API Reference

| Endpoint | Method | Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Register new user, hashes password, sets session cookie |
| `/api/auth/login` | `POST` | Public | Validates credentials, sets session cookie |
| `/api/auth/logout` | `POST` | Authenticated | Clears session cookie |
| `/api/auth/me` | `GET` | Authenticated | Returns current authenticated user record |
| `/api/products` | `GET`, `POST` | Authenticated | List all products or create product from UPC scan |
| `/api/products/[id]` | `GET`, `DELETE` | Authenticated | Fetch or delete specific product |
| `/api/listings` | `GET`, `POST` | Authenticated | Fetch listings or queue an approved AI draft |
| `/api/listings/[id]` | `GET`, `PATCH`, `DELETE`| Authenticated | Manage individual listing status/content |
| `/api/listings/[id]/publish`| `POST` | Authenticated | Push queued listing live to eBay or Shopify |
| `/api/dashboard/stats` | `GET` | Authenticated | Aggregate counts for live listings, queue, and revenue |
| `/api/integrations` | `GET`, `DELETE` | Authenticated | Check marketplace connection status or disconnect |
| `/api/ebay/auth` | `GET` | Authenticated | Initiates eBay OAuth 2.0 consent flow |
| `/api/ebay/auth/callback` | `GET` | Public | Receives eBay auth code and binds tokens to User in DB |
| `/api/shopify/auth` | `GET` | Authenticated | Initiates Shopify app install flow |
| `/api/shopify/auth/callback` | `GET` | Public | Exchanges Shopify offline code for persistent access token |
| `/api/upc/lookup` | `GET` | Authenticated | Resolves raw barcode numbers to product metadata |
| `/api/ai/optimize-listing` | `POST` | Authenticated | Generates multi-channel title, bullet points, and description |

---

## 🚀 Ideation & Scaling Prompts for Other LLMs

> **For AI Researchers, Engineers, and Advisors:**
> Below are structured prompts and unsolved problems you can feed into Claude, GPT-4o, DeepSeek, or Gemini Pro to brainstorm high-impact features and scale OmniList AI from an MVP to a multi-million dollar SaaS platform:

### Prompt 1: Dynamic Dimensional Weight & Profit Calculation Engine
```markdown
Context: OmniList AI lists products on eBay and Shopify from cross-border exporters (e.g., Pakistan, Turkey, Vietnam).
Challenge: International courier fees (DHL, FedEx) depend on Dimensional (Volumetric) Weight:
Formula: (Length x Width x Height in cm) / 5000 = Volumetric Weight in kg.
If Volumetric Weight > Actual Weight, courier bills the higher weight.
Marketplace commission takes ~13.25% + $0.30 (eBay) and Payoneer takes ~1.5% withdrawal fee.

Task: Design the mathematical specification and Next.js backend architecture for a Dynamic Profit Engine that:
1. Accepts dimensions and actual weight.
2. Fetches real-time or bracketed international courier tariffs.
3. Automatically computes the minimum break-even selling price and recommended target price to guarantee a user-chosen profit margin (e.g., 25% net).
4. Auto-injects this pricing into the Gemini AI listing prompt and draft panel.
```

### Prompt 2: Automated Competitor Scraper & Real-Time Repricer
```markdown
Context: OmniList AI has access to UPC, EAN, and brand names of cataloged products.
Task: Design an automated competitive repricing architecture that:
1. Queries eBay Browse API / SerpApi / Keepa to find active competitor prices for the exact same UPC or title.
2. Identifies the lowest, median, and Buy Box prices.
3. Alerts the user or automatically executes an algorithmic price change using OmniList's existing `publishListingToEbay` API.
4. What rate-limiting and job queue strategy (e.g., BullMQ, Upstash Redis, or serverless cron) should be used?
```

### Prompt 3: Mobile Native Scanning Companion & Warehouse Mode
```markdown
Context: Warehouse workers and retail arbitrageurs want to scan 100+ items per hour using their phone cameras.
Task: How can we turn OmniList's web application into a High-Speed Batch Scanning tool (PWA or React Native / Expo companion)?
1. Detail the batch barcode queue architecture where an operator can scan 20 items consecutively without waiting for AI generation.
2. Specify the background worker pipeline to process the queue asynchronously.
3. Propose UI patterns for rapid 1-click batch review and bulk marketplace publishing.
```

### Prompt 4: Multi-Tenant Team Collaboration & Role-Based Access Control (RBAC)
```markdown
Context: OmniList currently binds listings directly to individual `User` records. High-scale sellers have virtual assistants (VAs), photographers, and accountants.
Task: Propose a non-breaking Prisma schema migration to support Workspaces/Organizations:
1. Support `Organization` with roles: `OWNER`, `MANAGER`, `LISTER` (can only draft), and `VIEWER`.
2. Allow one user to belong to multiple stores.
3. Add audit logging for who approved and published each listing.
```

---

## 🛠️ Local Development & Deployment

### 1. Prerequisites
* Node.js 20+
* MySQL 8.0+ (or Hostinger Cloud MySQL)
* eBay Developer Account & Gemini API Key

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/mujeebabdul-99/omnilist-ai.git
cd omnilist-ai

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MySQL, Gemini, eBay, and Shopify keys

# Run Prisma migrations & generation
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### 3. Production Build
```bash
npm run build
npm run start
```
Hostinger auto-deploys within 2 minutes upon every push to the `main` branch.

---

## 📄 License & Attribution
Developed with precision by the OmniList engineering team. All rights reserved.
