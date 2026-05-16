# Sales Solution Composer Design

## Objective
Build an app where sales can describe requirements, attach Figma and solution docs, and automatically receive a composed implementation blueprint showing reusable existing blocks and net-new frontend/backend/API components.

## Architecture
- Frontend: Vite + React intake and results UI.
- Backend: Fastify API exposing atomic tool-like primitives.
- Shared contracts: `@app/shared` types.
- Storage: File-backed JSON database for requirements and generated plans.
- Indexing: Codebase scanner that identifies existing FE/BE/API building blocks.
- Planning: Engine that matches requirement intent to reusable blocks and proposes gaps.

## Data Flow
1. Sales creates requirement with goals, constraints, and target repo path.
2. Sales attaches Figma and solution document notes.
3. Backend indexes target repository files into normalized building blocks.
4. Planner generates:
   - Existing blocks
   - Net-new components by layer
   - Integration sequence and risks
5. UI renders blueprint for engineering handoff.

## Agent-Native Principles Applied
- Parity: Every UI action has an API primitive.
- Granularity: Tools are atomic (`createRequirement`, `addDocument`, `analyzeRequirement`).
- Composability: New planning behavior can be prompt/model logic change.
- Completion signal: analysis returns `shouldContinue=false` on completion.

## Testing
- Indexer test validates FE/BE/API detection.
- Planner test validates cross-layer output and integration steps.
