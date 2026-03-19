---
description: scaffold monorepo
---

# Project Context: Theater Company Headless Migration

**Goal:** Scaffold a monorepo for migrating the Flux Theatre Ensemble website from a monolithic WordPress setup to a modern headless architecture. 

**Tech Stack & Architecture:**
* **Monorepo Manager:** `pnpm` workspaces (or Turborepo)
* **Database & Storage:** Supabase (PostgreSQL + S3 Storage)
* **CMS (Backend):** Directus (Self-hosted, deployed to Railway)
* **Client (Frontend):** Vue 3 / Nuxt (or React / Next.js) with TypeScript and Tailwind CSS (deployed to Netlify as a Static Site / SSG)
* **UI/UX Design:** Stitch MCP

---

## Execution Phases

### Phase 1: Monorepo Initialization
1. Initialize a new monorepo named `flux-theatre-migration`.
2. Configure the workspace layout with two primary directories:
   * `/apps/cms` (for the Directus instance)
   * `/apps/web` (for the frontend client)
   * `/packages/shared` (for shared TypeScript types and UI configurations)
3. Set up the root `package.json` with scripts to build, lint, and run both environments concurrently in development.

### Phase 2: Frontend Setup & UI Design (via Stitch MCP)
1. Initialize a new frontend application in `/apps/web` using TypeScript and Tailwind CSS.
2. Configure the project for Static Site Generation (SSG) to optimize for Netlify's free tier.
3. **Engage Stitch MCP:** Use the Stitch Model Context Protocol to design and generate the core UI components for a theater company. Generate the following views:
   * **Homepage:** Hero banner, upcoming productions, and news/blog highlight.
   * **Productions Roster:** A grid layout displaying current and past plays with poster artwork.
   * **Single Production Page:** Layout for play description, cast/crew lists, showtimes, and ticket links.
   * **Cast/Creative Bios:** A standard modal or dedicated page for individual artist profiles.
4. Ensure all Stitch-generated components are heavily typed, expecting data payloads matching a headless CMS structure.

### Phase 3: Directus CMS Configuration (for Railway)
1. Initialize a barebones Node.js setup in `/apps/cms`.
2. Create the necessary `Dockerfile` or Railway configuration file (`railway.json` / `railway.toml`) to deploy Directus.
3. Generate a `.env.example` file that includes the necessary environment variables for:
   * Connecting to an external Supabase PostgreSQL database.
   * Configuring Supabase S3 storage for media uploads (images/playbills).
   * Directus admin credentials and telemetry settings.
4. Do not include a local SQLite database; the configuration must explicitly target the external Supabase instance to ensure Railway remains stateless.

### Phase 4: Deployment & CI/CD Preparation
1. **Netlify Prep:** Create a `netlify.toml` file in the root or `/apps/web` directory defining the build command (`pnpm build`) and publish directory for the frontend.
2. **Railway Prep:** Ensure the `/apps/cms` folder is isolated enough that Railway can build the Directus container directly from that subdirectory without building the frontend.
3. **Shared Types Prep:** Generate a starter `types.ts` in `/packages/shared` mapping out the expected database schema (e.g., `Production`, `CastMember`, `Venue`) so both the CMS configuration and the Nuxt/Next client are synced.