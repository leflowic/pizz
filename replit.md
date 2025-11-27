# La Tavernetta Pizzeria Website

## Overview

A modern, elegant website for La Tavernetta, an authentic Italian pizzeria, built with React. It provides an engaging user experience with smooth animations and interactive components, showcasing the restaurant's menu, gallery, and delivery services. Key features include a redesigned digital menu optimized for QR code access, a protected admin dashboard for comprehensive management (orders, menu, gallery, featured products, site content), robust SEO, and premium UI/UX elements like custom cursors and glassmorphism design. The project aims to establish a sophisticated online presence reflecting the pizzeria's quality and tradition.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:** React 18 with TypeScript, Vite, Wouter for routing, and React Query for server state management.

**Styling System:** Tailwind CSS v4, shadcn/ui (with Radix UI primitives), and Framer Motion for animations. Features a dark-first color scheme with Italian flag accents and specific fonts (Plus Jakarta Sans, Inter).

**Component Architecture:** Modular, section-based, with reusable UI components and a protected admin dashboard. Includes custom interactive elements like `CustomCursor` and animated icons.

**State Management:** React hooks for local state and React Query for server data.

**UI/UX Decisions:**
- **Design Language:** Dark, elegant, Italian cultural aesthetics with glassmorphism effects.
- **Navigation:** Clean, professional with a single "JELOVNIK" link and a "Featured Pizzas" showcase linking to the full menu.
- **Digital Menu (`/jelovnik`):** Optimized for QR code/mobile, white background, sticky category tabs, clear pricing, smooth animations, and a premium "Candy Eye" redesign with glassmorphism cards. Populated with 137 items across 12 categories, with 66 professional product images.
- **About Section:** Updated with "7 dana - Otvoreno Nedeljno" and "100% - Kvalitet i Zadovoljstvo".
- **Custom Cursor:** High-performance, globally rendered, hidden on mobile/tablet.
- **Animations:** Smooth scroll animations, blur-to-focus transitions, and parallax hero effects.
- **Branding:** Consistent transparent La Tavernetta logo.
- **Accessibility:** Custom 404 page, enhanced contact section with functional links and dark-themed Google Maps embed with precise GPS coordinates (44.80163611164573, 20.493545890830816).
- **Real-time Features:** Working hours live status indicator, ordering availability check - when ordering is disabled via admin panel, a toast notification appears prompting users to call the restaurant instead.
- **Call-to-Action:** "Rezerviši Sto" buttons throughout the site (Hero, DeliverySection) are direct tel: links to +381112405320 for instant phone calls.
- **Mobile-First Responsive Design:** Fully optimized for mobile devices across all pages, including the admin panel.
- **Customer Reviews Showcase:** ReviewsSection carousel component displays approved 4-5 star reviews with glassmorphism cards, star ratings, customer names, and relative timestamps. Powered by embla-carousel, positioned between YouTube Video and Social Proof sections on homepage.
- **Review Submission Form:** ReviewForm component allows visitors to submit reviews directly on the website with name, rating (1-5 stars), and comment fields. All submissions start as unapproved (`isApproved: false`) and require admin approval before appearing publicly. Interactive star selector with hover effects, full client-side validation, and success/error toast notifications. Positioned immediately after ReviewsSection carousel.
- **YouTube Video Section:** Premium video showcase positioned between Gallery and Reviews sections. Features glassmorphism card design with animated border gradients, floating particle effects, responsive aspect-ratio video player, and Italian flag-colored accent dots below. Embeds YouTube kitchen/cooking footage with `rel=0` and `modestbranding=1` parameters. Fully responsive with mobile-optimized layout. Video ID: WYLNX6DImTo (restaurant's actual kitchen footage).
- **Content Protection:** Comprehensive media protection via ContentProtection component - prevents right-click context menu on images/videos/iframes, disables drag-and-drop, blocks user-select/user-drag CSS properties, prevents mobile long-press context menus, and intercepts Ctrl/Cmd+S save shortcuts when media is focused. Protection applies site-wide without affecting normal user interactions or browser functionality outside of protected media elements.
- **SEO & PWA:** Comprehensive server-side and client-side SEO optimization. Server-side meta tag injection via `server/seo.ts` delivers route-specific titles, descriptions, OG tags, and complete JSON-LD structured data (@graph with Restaurant, Website, Video, LocalBusiness, Menu, Breadcrumb schemas) to bots without JavaScript hydration. Client-side SEO component manages dynamic meta updates post-hydration. Image sitemap, robots.txt, canonical tags, Twitter Cards, and harmonized @id references throughout. PWA manifest for "Add to Home Screen" functionality, favicon and Apple touch icons configured.

### Backend Architecture

**Server Framework:** Express.js on Node.js with TypeScript and ESM.

**API Structure:** RESTful API with modular route registration.

**Server-Side SEO Prerendering:** Route-specific meta tag injection via `server/seo.ts` middleware. Injects complete structured data (Restaurant, Website, Video, LocalBusiness, Menu, Breadcrumb schemas) into HTML before sending to bots. Supports "/" and "/jelovnik" routes with distinct titles, descriptions, OG tags, and JSON-LD payloads. Ensures crawlers see accurate metadata without JavaScript hydration. Works in both development and production environments via `server/vite.ts` integration.

**Storage Layer:** `IStorage` interface with `MemStorage` in-memory implementation for development, designed for database integration.

### Data Layer

**Database Configuration:** Drizzle ORM for PostgreSQL integration with Neon Database (serverless PostgreSQL). Includes `drizzle-kit` for migrations and Zod for schema validation.

**Schema Design:**
- **Users Table:** UUID primary keys, Zod validation.
- **Settings Table:** Key-value for application configuration (e.g., ordering control).
- **Site Content Table:** Key-value for dynamic website content (hero, about, contact, working hours), managed via admin panel.
- **Menu Items Table:** Comprehensive category support (14 categories including pizzas, pastas, drinks), flexible pricing with `price` (single price) or `sizes` (JSON array of {name, price} for multiple sizes like 32cm/42cm/50cm), `imageUrl`, `available` flag, and `isNew` and `featured` boolean flags. Populated with 137 items. Legacy `price32`/`price42` fields deprecated in favor of dynamic `sizes` system.
- **Gallery Images Table:** `imageUrl`, `alt` text, `displayOrder`, admin-controlled.
- **Coupons Table:** Discount code management - `code` (unique), `discountType` (percentage/fixed), `discountValue`, `minOrder`, `maxUses`, `usedCount`, `expiresAt`, `isActive`. Full validation via Zod schema.
- **Reviews Table:** Customer reviews with dual-source support - `customerName`, `rating` (1-5 stars), `comment`, `isApproved` (default false), `createdAt`, `source` (manual/google), `googleReviewId` (unique), `reviewDate`, `profilePhotoUrl`. Admin approval workflow for manual reviews; Google reviews auto-approved. De-duplication via `googleReviewId`.

**Session Management:** `connect-pg-simple` for PostgreSQL-backed sessions.

## External Dependencies

**UI Component Libraries:**
- **Radix UI:** Accessible, unstyled primitives for core components.
- **Embla Carousel:** Touch-enabled carousel.
- **Lucide React:** Icon library.

**Animation & Visual:**
- **Framer Motion:** Complex transitions and gestures.
- **class-variance-authority:** Type-safe component variant management.
- **tw-animate-css:** Tailwind animation utilities.
- **html2canvas:** DOM to canvas rendering (for menu export).

**Forms & Validation:**
- **React Hook Form:** Form state management.
- **Zod:** Schema validation.
- **@hookform/resolvers:** Integration with React Hook Form.

**Database & ORM:**
- **Drizzle ORM:** Type-safe SQL query builder.
- **@neondatabase/serverless:** Serverless PostgreSQL driver.
- **pg:** PostgreSQL client.

**Utilities:**
- **date-fns:** Date manipulation.
- **clsx** + **tailwind-merge:** Conditional className utilities.
- **nanoid:** Unique ID generation.
- **Sonner:** Premium toast notification system (Apple-inspired glassmorphism).
- **multer:** File upload handling.
- **bcrypt:** Password hashing.
- **qrcode:** QR code generation.

**Font Integration:**
- **Google Fonts:** Plus Jakarta Sans and Inter.

**Admin System:**
- **Wolt Integration (Demo):** Mock order flow.
- **Menu Management:** Full CRUD operations for menu items, image uploads, category selection for all 14 categories (with emoji icons), "NOVO" badge system, and "Featured" product designation.
- **Featured Products Control:** Admin can mark any menu item as "featured" for homepage display, with a dedicated filter.
- **Gallery Management:** Dedicated tab for managing homepage gallery images (add/delete, descriptions, display order).
- **Site Content Management (CMS):** Dedicated "Sadržaj" tab for managing all website content (Hero, About, Contact, Working Hours) with controlled inputs and auto-save.
- **Promotions/Coupons Management:** Dedicated "Promocije" tab with full CRUD - create discount codes (percentage/fixed), set expiry dates, minimum order values, usage limits, activate/deactivate. Real-time usage tracking.
- **Reviews Management:** Dedicated "Recenzije" tab - approve/reject customer reviews (1-5 stars with comments), filter by status (all/approved/pending), delete inappropriate content. Badge counter for pending reviews. **Google Reviews Integration:** Configure Google Places API in Settings tab (API key + Place ID), manual "Fetch Reviews" button pulls up to 5 most recent 4-5 star reviews, automatic de-duplication via `googleReviewId`, Google reviews auto-approved.
- **Analytics Dashboard:** Dedicated "Analitika" tab showing real-time statistics - menu items (total, available, featured), reviews (total, approved, average rating), coupons (total, active), top 5 featured products.
- **Backup/Export:** One-click JSON export of entire database (menu items, gallery, site content, coupons, reviews) with timestamped filename in Settings tab.
- **QR Code Generator:** Simple QR code generator in "Postavke" tab - generates one clean QR code linking directly to https://latavernetta.rs/jelovnik for printing and placing on restaurant tables. One-click download as PNG.
- **User Management:** Dedicated "Korisnici" tab - create new admin users with secure password hashing (bcrypt), view all admin accounts (ID, username, status), admin-only access with authentication middleware. Passwords never returned in API responses.
- **Ordering Control:** Toggle switch to enable/disable online ordering site-wide.
- **Mobile Responsive:** Fully optimized for mobile access.
- **PWA Support:** Progressive Web App with restaurant logo as app icon, manifest.json for "Add to Home Screen" on mobile devices, works like native app.
- **Quick Admin Access:** Discreet admin panel link in footer with key icon (🔑) - visible on all pages for quick access from mobile devices.

## Deployment on Railway

### Prerequisites
1. Railway account (https://railway.app)
2. PostgreSQL database (Railway provides built-in PostgreSQL)

### Deployment Steps
1. **Push to GitHub:** Push this repository to GitHub
2. **Create Railway Project:** Go to Railway Dashboard → "New Project" → "Deploy from GitHub Repo"
3. **Select Repository:** Choose your repository
4. **Add PostgreSQL:** In Railway, add a new PostgreSQL database service
5. **Set Environment Variables:** In the Variables tab, add:
   - `DATABASE_URL` - Railway provides this automatically when you link PostgreSQL
   - `ADMIN_PASSWORD` - Your admin password (required)
   - `SESSION_SECRET` - Random string for session encryption (recommended)
6. **Generate Domain:** Settings → Networking → "Generate Domain"
7. **Run Database Migration:** After first deploy, run `npm run db:push` via Railway CLI or web console

### Environment Variables Required
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| ADMIN_PASSWORD | Yes | Password for admin account |
| SESSION_SECRET | No | Session encryption key (uses default if not set) |
| PORT | Auto | Railway sets this automatically |

### Build & Start Commands
Railway auto-detects these from package.json:
- **Build:** `npm run build` (builds client and server)
- **Start:** `npm run start` (runs production server)

### Files for Railway
- `railway.json` - Railway-specific configuration
- `Procfile` - Alternative process specification
- `.env.example` - Template for required environment variables