# Task Todo Client

Next.js frontend for the Task Todo API. Works with **npm**, **pnpm**, and **yarn**.

## Requirements

- Node.js >= 18
- [Task Todo API](../../api/README.md) running at `http://localhost:3001`

## Quick start

```bash
cp .env.example .env.local
pnpm install          # or npm install / yarn install
pnpm dev              # or npm run dev / yarn dev
```

App: `http://localhost:3000`

---

## Getting started

### 1. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Task Todo API base URL | `http://localhost:3001` |

The API must allow this client origin in `CORS_ORIGINS` (default: `http://localhost:3000`).

### 2. Install dependencies

**npm**
```bash
npm install
```

**pnpm**
```bash
pnpm install
```

**yarn**
```bash
yarn install
```

### 3. Run the dev server

**npm**
```bash
npm run dev
```

**pnpm**
```bash
pnpm dev
```

**yarn**
```bash
yarn dev
```

### 4. Production build

```bash
npm run build && npm run start
# or: pnpm build && pnpm start / yarn build && yarn start
```

---

## API connection

Use the helpers in `lib/api.ts`:

```ts
import { apiFetch } from "@/lib/api";

const response = await apiFetch("/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

The base URL comes from `NEXT_PUBLIC_API_URL` (see `lib/env.ts`).
