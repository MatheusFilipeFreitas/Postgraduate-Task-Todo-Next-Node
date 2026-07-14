# Postgraduate Task Todo — Next.js & Node.js

Full-stack task management application built for a postgraduate React course. The repository contains a **Node.js/Express REST API** backed by **PostgreSQL** and a **Next.js** web client for authentication and task management.

## Repository structure

```
task-todo/
├── api/                    # Express + TypeScript REST API
│   ├── docker/             # PostgreSQL via Docker Compose
│   ├── migrations/         # node-pg-migrate schema files
│   ├── postman/            # Postman collection & environment
│   ├── scripts/            # DB setup and seed scripts
│   └── src/                # Routes, services, repositories
└── client/
    └── todo-client/        # Next.js 16 + React 19 frontend
        ├── app/              # App Router pages & API routes (BFF)
        ├── components/       # UI components (Kanban, task list, etc.)
        ├── context/          # Auth context provider
        ├── hooks/            # useAuth, useTasks, useToast
        └── lib/              # API clients and utilities
```

## Quick start

Run the API and frontend in separate terminals.

### 1. API (`api/`)

```bash
cd api
cp .env.example .env
pnpm install          # or npm install / yarn install
pnpm docker:up        # start Postgres, migrate, and seed
pnpm dev              # http://localhost:3001
```

Seed user: `john@example.com` / `secret123`

See [`api/README.md`](./api/README.md) for full API documentation, endpoints, migrations, Docker, and Postman usage.

### 2. Frontend (`client/todo-client/`)

```bash
cd client/todo-client
cp .env.example .env.local
pnpm install          # or npm install / yarn install
pnpm dev              # http://localhost:3000
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API (must match `CORS_ORIGINS` in the API `.env`) | `http://localhost:3001` |

## How the apps work together

```
Browser (localhost:3000)
    │
    ├─► Next.js pages (React UI)
    │
    └─► Next.js API routes (/api/*)  ← BFF layer
            │
            └─► Express API (localhost:3001)
                    │
                    └─► PostgreSQL
```

The frontend does **not** call the Express API directly from the browser for most operations. Instead, **Next.js Route Handlers** under `app/api/` act as a backend-for-frontend (BFF):

- Auth routes (`/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/session`) proxy requests to the Express API and manage the `auth-jwt` httpOnly cookie on the Next.js domain.
- Task routes (`/api/tasks`) forward CRUD operations to Express with the JWT from cookies.
- Client-side code in `lib/tasks.api.ts` and `context/auth.api.ts` calls these local `/api/*` endpoints with `credentials: "include"`.

Route protection is handled by `proxy.ts` (Next.js middleware): unauthenticated users are redirected to `/login`; authenticated users are redirected away from `/login` and `/signup`.

## API overview

REST API for user authentication and per-user task CRUD.

| Area | Base path | Description |
|------|-----------|-------------|
| Auth | `/auth/*` | Register, login, logout, session, current user |
| Tasks | `/tasks/*` | List, create, update status, delete (JWT required) |
| Health | `/health` | Server and database status |

**Stack:** Express 5, TypeScript, PostgreSQL 16, JWT + httpOnly cookies, bcrypt, Helmet, CORS, rate limiting.

**Architecture:** routes → services → repositories → PostgreSQL.

For the complete endpoint reference, error codes, auth details, and curl examples, see [`api/README.md`](./api/README.md).

## Frontend overview

Next.js App Router application with a task dashboard, Kanban board, list view, and auth flows.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Home dashboard — greeting, progress stats, quick-add task, recent tasks |
| `/tasks` | Full task management — Kanban or list view, filters, sorting |
| `/tasks/create` | Dedicated task creation form |
| `/login` | User login |
| `/signup` | User registration |

### Features

- JWT session via httpOnly cookie (managed by Next.js API routes)
- Kanban board and list view with persisted view preferences
- Task status workflow: `pending` → `in_progress` → `completed`
- Progress tracking, quick-add, status toggles, and delete confirmation
- Responsive layout with mobile navigation
- Toast notifications for user feedback

### Key modules

| Path | Role |
|------|------|
| `context/auth.context.tsx` | Global auth state (login, register, logout, session restore) |
| `hooks/useTasks.ts` | Task loading, creation, status updates, deletion |
| `components/kanban-board.tsx` | Drag-style status columns |
| `components/home-dashboard.tsx` | Landing dashboard after login |
| `lib/api.server.ts` | Server-side fetch to Express with Bearer token from cookies |
| `proxy.ts` | Auth gate middleware for protected routes |

**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4.

## Requirements

- Node.js >= 18
- Docker & Docker Compose (for PostgreSQL)
- pnpm, npm, or yarn

## Development ports

| Service | URL |
|---------|-----|
| Next.js client | http://localhost:3000 |
| Express API | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

## License

Educational project — postgraduate React course.
