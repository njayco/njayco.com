# NJAYCO OS

A Windows XP-inspired interactive operating system website for [NJAYCO.com](https://njayco.com) — simulating a full desktop experience in the browser with a boot sequence, login screen, draggable windows, Start Menu, taskbar, and dedicated apps for 20+ company divisions.

![NJAYCO OS](https://img.shields.io/badge/NJAYCO-OS-0052cc?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)

---

## Overview

NJAYCO OS transforms the NJAYCO corporate website into an immersive Windows XP desktop simulation. Visitors interact with the site as if they're using an operating system — booting up, logging in, opening windows, browsing divisions, playing music, and exploring files.

### Key Features

- **Boot Sequence** — Animated startup with NJAYCO branding, progress bar, and system loading messages
- **Login Screen** — Guest and Administrator accounts with blurred division icon sidebars
- **Desktop** — All 22 divisions displayed as clickable desktop icons with drag-and-drop windows
- **Start Menu** — Pinned apps, All Programs view with Applications + live Divisions list, Run dialog, and Shut Down options
- **Taskbar** — Active window tabs, system tray with clock/volume/network indicators
- **Window Management** — Drag, resize, minimize, maximize, and close windows with XP-style chrome
- **Mobile Fallback** — Responsive screen for devices under 768px

---

## Applications

| App | Description |
|-----|-------------|
| **UV Music Group** | iTunes-style music store with album grid, track library, artist cards, and a bottom now-playing bar with transport controls, scrub slider, and volume |
| **File Explorer** | XP folder hierarchy — Desktop, My NJAYCO (C:), Divisions, Documents, Music, Media, Services, Press Kit, Investor |
| **Internet Explorer** | Embedded browser with iframe support and fallback cards for blocked sites |
| **Notepad** | Simple text editor for division notes and content |
| **Company Info** | Division detail cards with descriptions, status badges, and links |
| **Control Panel** | Admin dashboard with 9 tabs — Dashboard, Analytics, Divisions Manager, Content Manager, Music Library, Documents, Users & Roles, Desktop Layout, System Settings |

---

## Divisions

NJAYCO OS showcases 22 company divisions across categories:

| Division | Status | Category |
|----------|--------|----------|
| My NJAYCO | Live | Corporate |
| About Najee Jeremiah | Live | Corporate |
| NJAYCO Corporate | Live | Corporate |
| UV EMPIRE | Live | Media |
| Unrevealed Brand | Live | Creative |
| UV Music Group | Live | Music |
| YsUp, Inc. | Live | Tech |
| YsUp Campus | Live | Education |
| Howard Unrevealed | Concept | Education |
| Wax Radio | Development | Media |
| Greet Me | Development | Tech |
| Denoko | Concept | Tech |
| Denoko Taxi | Development | Logistics |
| Frankie's Elite Transport | Development | Logistics |
| Teemer Moving & Storage | Development | Logistics |
| Prom Queen | Concept | Creative |
| Phone Msgr | Development | Tech |
| Contact | Live | Corporate |
| Press Kit | Live | Corporate |
| Investor Info | Live | Corporate |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS 4, Framer Motion |
| **State** | Zustand (persisted to localStorage) |
| **Data Fetching** | TanStack React Query, OpenAPI-generated client |
| **Backend** | Express, Pino logger, Zod validation |
| **Database** | PostgreSQL with Drizzle ORM |
| **Monorepo** | pnpm workspaces with shared libs (`@workspace/db`, `@workspace/api-client-react`, `@workspace/api-zod`) |

---

## Project Structure

```
artifacts/
  njayco-os/          # Frontend — React + Vite desktop OS
    src/
      pages/            # BootScreen, LoginScreen, Desktop
      components/
        desktop/          # Taskbar, StartMenu, DesktopIcon, WindowWrapper
        apps/             # MusicApp, ExplorerApp, AdminApp, BrowserApp, NotepadApp, CompanyInfoApp
      store/              # Zustand store (use-desktop-store)
      hooks/              # React Query hooks (use-music-hooks)
  api-server/           # Backend — Express REST API
    src/
      routes/             # divisions, music, documents, admin
      app.ts              # Server setup + seed logic

lib/
  db/                   # Drizzle ORM schema + migrations
    src/schema/           # divisions, music, documents, admin-settings
  api-zod/              # Zod schemas generated from OpenAPI
  api-client-react/     # Generated API client + React Query hooks
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# DATABASE_URL=postgresql://...
# ADMIN_TOKEN=your-secret-admin-token
# VITE_ADMIN_TOKEN=your-secret-admin-token

# Push database schema
pnpm --filter @workspace/db run push

# Start the API server
pnpm --filter @workspace/api-server run dev

# Start the frontend
pnpm --filter @workspace/njayco-os run dev
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/divisions` | Public | List all divisions |
| GET | `/api/divisions/:id` | Public | Get division by ID |
| GET | `/api/artists` | Public | List all artists |
| GET | `/api/albums` | Public | List all albums |
| GET | `/api/tracks` | Public | List all tracks |
| GET | `/api/documents` | Public | List all documents |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/settings` | Public | System settings |
| PUT | `/api/admin/divisions` | Admin | Update a division |
| PUT | `/api/admin/settings` | Admin | Update a setting |

---

## License

Copyright 2024 NJAYCO, Inc. All rights reserved.
