# Docker — Task Todo API

PostgreSQL runs in Docker. Migrations and seeds run from the **host** via npm scripts.

## Start

```bash
# From api/ root
npm run docker:up
```

Equivalent to:

```bash
docker compose -f docker/docker-compose.yml up -d --wait
npm run db:setup
```

## Environment

Copy optional overrides:

```bash
cp docker/.env.example docker/.env
```

| Variable | Default |
|----------|---------|
| `POSTGRES_DB` | `task_todo` |
| `POSTGRES_USER` | `task_todo` |
| `POSTGRES_PASSWORD` | `task_todo` |
| `POSTGRES_PORT` | `5432` |

These must match `DB_*` values in the root `.env` file.

## Reset

```bash
npm run docker:reset && npm run docker:up
```

Removes the `postgres_data` volume and re-runs migrations + seed.

## Migrations inside Docker?

No. The Postgres container only runs the database engine.  
Migrations are applied by **node-pg-migrate** from the API project (`db:setup` or API startup).
