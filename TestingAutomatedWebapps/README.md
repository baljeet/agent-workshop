# Sales Solution Composer

A TypeScript app that turns sales requirements + Figma/docs into an implementation blueprint by identifying existing and net-new frontend/backend/API building blocks.

## Monorepo Layout

- `apps/api` - Fastify API with indexing and planning engine
- `apps/web` - React UI for intake and analysis results
- `packages/shared` - shared domain types

## Run Locally

```bash
npm install
npm run dev:api
npm run dev:web
```

API default: `http://localhost:4200`
Web default: `http://localhost:5173`

## Core Endpoints

- `POST /requirements`
- `POST /requirements/:id/documents`
- `POST /requirements/:id/analyze`
- `GET /requirements/:id`
- `GET /capabilities/types`

## Notes

- Analysis scans files under `targetRepoPath` and infers reusable blocks by file naming/content heuristics.
- Generated plan includes existing blocks, net-new blocks, integration steps, and risks.
