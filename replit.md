# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Project: NJAYCO OS

**NJAYCO OS** is a Windows XP-inspired interactive operating system website for The Najee Jeremiah Company.

### Core Features
- **Boot Screen**: Animated boot sequence with loading bar, auto-progresses to login
- **Login Screen**: XP-style with 3 user roles (Administrator, Log In, New Guest), responsive (stacks vertically on mobile, hides sidebars)
- **Desktop**: Wallpaper (futuristic XP-style), draggable/resizable windows via react-rnd, desktop icons from database divisions
- **Pocket OS (Mobile)**: Below 768px breakpoint, replaces desktop with touch-friendly mobile experience — 3-column icon grid, single-tap to open, fullscreen window panels (one at a time), simplified taskbar, fullscreen start menu overlay
- **Taskbar**: XP-style with N Start button, open window items, clock, system tray icons
- **Start Menu**: Pinned apps, file shortcuts, Log Off / Shut Down dialog
- **Window Types**: `browser` (iframe), `notepad` (text editor), `music` (iTunes-style), `explorer` (file manager), `admin` (dashboard), `company`/`custom` (company info pages)
- **State**: Zustand store (`njayco-os-storage`) persists `visited` and `user` in localStorage

### Frontend: `artifacts/njayco-os` (`@workspace/njayco-os`)
React + Vite at previewPath `/` (port from `$PORT`). Key files:
- `src/pages/BootScreen.tsx`, `LoginScreen.tsx`, `Desktop.tsx`
- `src/store/use-desktop-store.ts` — Zustand store
- `src/components/desktop/` — Taskbar, StartMenu, WindowWrapper, DesktopIcon (exports `IconBadge`)
- `src/components/mobile/` — MobileDesktop, MobileWindowPanel, MobileTaskbar, MobileStartMenu
- `src/components/apps/` — BrowserApp, NotepadApp, MusicApp, ExplorerApp, AdminApp, CompanyInfoApp
- `src/hooks/use-music-hooks.ts` — React Query wrappers

### API Server Routes (Express at port 8080)
- `GET /api/divisions` — All 21 divisions ordered by sortOrder
- `GET /api/artists`, `GET /api/albums`, `GET /api/tracks`
- `GET /api/documents`
- `GET /api/admin/stats`
- `PUT /api/divisions/:id`

### Database (PostgreSQL + Drizzle)
- Tables: `divisions`, `artists`, `albums`, `tracks`, `documents`
- Seed: `pnpm --filter @workspace/scripts run seed-njayco`
- 21 divisions seeded covering all NJAYCO brands

### Key Design Decisions
- Icons: database stores lowercase names (e.g., "folder"), DesktopIcon converts to PascalCase for Lucide
- `custom` window type renders CompanyInfoApp with division-specific content
- Divisions with slug `my-njayco` and `recycle-bin` filtered from desktop (handled via special icons)

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
