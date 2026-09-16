FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3001

# Migrate + seed (idempotent), then start the compiled server
CMD ["sh", "-c", "npx tsx scripts/db-setup.ts && node dist/index.js"]
