# Example Workshop Transcript: Collaborative Todo App

> **Workshop:** Design a real-time collaborative todo app with offline support  
> **Facilitator:** Human user  
> **Agents:** Claude Code (Design Author), Pi (Product Critic + Scalability Engineer), Codex (Integration Specialist + DevEx Advocate)  
> **Date:** 2026-05-18  
> **Duration:** 2.5 hours  

---

## Pre-Workshop Setup

**Facilitator loads Workshop Charter into all agents.**

```markdown
WORKSHOP CHARTER
================
We are conducting a structured multi-agent design workshop.

PROJECT: Real-Time Collaborative Todo App
GOAL: Design a todo app where multiple users can edit lists simultaneously,
      with changes syncing in real-time, and full offline support.

FACILITATOR: Human User
AGENTS PARTICIPATING: Claude Code (Design Author), Pi (Product Critic + Scalability), Codex (Integration + DevEx)

PROTOCOL RULES:
1. We work in 8 phases. We NEVER skip phases.
2. Each phase ends when the FACILITATOR says "APPROVED, proceed to Phase N+1."
3. Any agent may raise:
   - BLOCK: [section] — [critical issue, halts progress]
   - CONCERN: [section] — [non-blocking risk]
   - CONSENT: [section] — [endorsement]
4. The facilitator synthesizes all outputs into a single artifact per phase.
5. All outputs follow the specified format. Off-format responses will be rejected.

We begin with PHASE 1: Problem Framing.
```

---

## Phase 1: Problem Framing (Roundtable)

### Facilitator → All Agents (P1 Prompt)

```markdown
# PHASE 1: Problem Framing
**Mode:** Roundtable
**Objective:** Understand and document the user's intent, constraints, and success criteria
**Prior Approved Artifacts:** None (first phase)
**Output Artifact:** P1 Problem Statement

## YOUR ROLE
ROLE: {{ASSIGNED_ROLE}}
INSTRUCTIONS:
- Analyze the user's stated intent below
- Identify: what problem we're solving, who it's for, why it matters
- Identify constraints: technical, business, regulatory, time, budget
- Define success criteria: how do we know this is done and done well?
- Define anti-requirements: what is explicitly OUT of scope?
- Do NOT propose solutions yet. This phase is purely about understanding the problem.
- Always find at least one ambiguity or question to raise. Never say "this is clear."

## INPUT / CONTEXT
USER INTENT:
"I want to build a real-time collaborative todo app. Multiple users should be able to
edit the same todo list at the same time and see changes instantly. It must work
offline — users can add/edit/delete todos without internet, and sync when back online.
No conflicts should be lost. It should feel as smooth as Google Docs."

KNOWN CONTEXT:
- Target: Web app (desktop + mobile browsers)
- Team: 2 backend engineers, 1 frontend engineer
- Budget: Free tier cloud + reasonable paid tier as needed
- Timeline: 8 weeks to MVP
```

### Agent Responses

**Claude Code (Design Author):**
```markdown
### Problem Summary
Build a real-time collaborative todo web app where multiple users can simultaneously
edit shared lists with conflict-free offline support. The experience should feel
instantaneous and reliable, comparable to Google Docs.

### Constraints
- Hard: 8-week timeline, 3 engineers, web browsers only
- Hard: Offline functionality is mandatory (not optional)
- Hard: No data loss on conflicts
- Soft: Free tier cloud preferred
- Soft: Mobile browser must be usable (not native app)

### Success Criteria
- [SC1] Two users editing simultaneously see changes within <200ms
- [SC2] Offline mode supports full CRUD; syncs seamlessly on reconnection
- [SC3] Zero data loss when conflicts occur (merge, never overwrite)
- [SC4] MVP deployable and usable by 10 beta users

### Anti-Requirements (Out of Scope)
- Native mobile apps (iOS/Android)
- Authentication beyond basic email/password
- Notifications/push
- File attachments on todos
- Admin dashboard

### Ambiguities / Questions
- Q1: What is the expected max number of simultaneous editors per list? (2? 10? 100?)
- Q2: Is there a need for private vs shared lists, or all lists are collaborative?
- Q3: What is "conflict-free" — automatic merge or manual resolution?

### CONSENT with notes. Q1-Q3 need answers before P2 but don't block P1.
```

**Pi (Product Critic):**
```markdown
### Problem Summary
A shared todo app for teams or small groups that works flawlessly online and offline.
The core value prop is confidence: users never worry about losing work or seeing stale data.

### Constraints
- Hard: Web-only (responsive design for mobile browsers)
- Hard: 8 weeks limits architectural complexity
- Soft: Free tier means we need to be careful about data transfer and storage

### Success Criteria
- [SC1] <200ms sync (agree with Claude)
- [SC2] Offline CRUD + seamless sync (agree)
- [SC3] Automatic conflict resolution, no user intervention (add specificity)
- [SC4] Works on low-end mobile browsers (add constraint)

### Anti-Requirements
- Agree with Claude. Additional: No real-time cursors/selection highlighting (too complex for 8 weeks).

### Ambiguities / Questions
- Q1: Agree with Claude — concurrent user count drives architecture
- Q2: Are we building for teams (organizational) or friends/family (personal)?
   This changes UX and auth requirements significantly.
- Q3: What happens if two users delete and edit the same todo offline?
   This is the critical edge case we need to define.
- Q4: Browser support matrix? (Chrome, Safari, Firefox, Edge? IE11?)

### CONSENT with 4 questions flagged. Q2 (target audience) is highest priority.
```

**Codex (Integration + DevEx):**
```markdown
### Problem Summary
A web-based collaborative todo system with offline-first sync. The hard part is
conflict resolution on reconnect, not the basic todo CRUD.

### Constraints
- Hard: 8 weeks, 3 devs. CRDT or OT will eat 3-4 weeks alone.
- Hard: Free tier means think about data volume from the start
- Soft: Easy local setup for the team (DevEx)

### Success Criteria
- [SC1] <200ms sync for same-list edits
- [SC2] Offline CRUD with eventual consistency
- [SC3] No silent data loss (disagree with "automatic" — at minimum user needs feedback)
- [SC4] One-command local dev setup

### Anti-Requirements
- Agree with Claude. Additional: No custom sync protocol — use established libraries.

### Ambiguities / Questions
- Q1: How do we handle device switching? (User edits on phone offline, then laptop online)
  This is a hard distributed systems problem masked by "offline support."
- Q2: Is there a server at all, or are we considering peer-to-peer?
  P2P removes server costs but massively complicates sync.
- Q3: What is the data retention policy? Do deleted todos stay recoverable?

### CONCERN on "automatic conflict resolution without user feedback."
  Users should see when conflicts were resolved, otherwise they'll distrust the system.

### CONSENT with the documented concern.
```

---

### Facilitator Synthesis (P1 Artifact)

```markdown
# P1 Problem Statement — Collaborative Todo App

## Problem Summary
Build a real-time collaborative todo web app where multiple users simultaneously
edit shared lists with conflict-free offline support. Target: small teams or
family groups. Experience should feel instantaneous and reliable.

## Constraints
- **Hard:** Web browsers only (desktop + mobile), 8-week timeline, 3 engineers
- **Hard:** Offline CRUD mandatory; automatic sync on reconnection
- **Hard:** Zero silent data loss on conflicts (user-visible resolution log)
- **Soft:** Free tier cloud preferred
- **Soft:** One-command local dev setup

## Success Criteria
- [SC1] Two users editing same list see changes within <200ms
- [SC2] Offline mode: full CRUD, seamless sync on reconnect
- [SC3] All conflicts resolved automatically with user-visible audit log
- [SC4] MVP usable by 10 beta users on modern browsers (Chrome, Safari, Firefox, Edge)

## Anti-Requirements (Out of Scope)
- Native mobile apps
- Push notifications
- File attachments
- Admin dashboard
- Real-time cursor/selection highlighting
- Custom sync protocol (use established library)
- IE11 support

## Resolved Ambiguities
- Max concurrent editors per list: **10** (enough for small teams, keeps architecture simple)
- Target audience: **small teams** (organizational, not family/friends)
- Conflict resolution: **automatic merge with visible change log**
- Browser support: **last 2 versions of Chrome, Safari, Firefox, Edge**
- Data retention: **soft delete only, recoverable for 30 days**

## Open Questions (deferred to P2)
- Q3 (Codex): Device switching behavior — addressed as edge case in P2
```

### Phase Gate

**Facilitator:** "P1 COMPLETE. BLOCK check?"

- Claude Code: CONSENT
- Pi: CONSENT
- Codex: CONCERN noted (already incorporated)

**Facilitator:** "APPROVED, proceed to Phase 2."

---

## Phase 2: Requirements Elicitation (Roundtable)

### Facilitator → All Agents (P2 Prompt)

```markdown
# PHASE 2: Requirements Elicitation
**Mode:** Roundtable
**Objective:** Extract complete requirements from the problem statement
**Prior Approved Artifacts:** P1 Problem Statement
**Output Artifact:** P2 Requirements Document

## INPUT / CONTEXT
{{P1_ARTIFACT}}
```

### Agent Responses

**Claude Code (Design Author):**
```markdown
### Functional Requirements
| ID | Requirement | MoSCoW | Notes |
|----|-------------|--------|-------|
| R1 | User can create/edit/delete todos | Must | Basic CRUD |
| R2 | User can create/edit/delete todo lists | Must | Container for todos |
| R3 | Multiple users can view/edit same list | Must | Real-time collaboration |
| R4 | Changes sync in <200ms to other viewers | Must | SC1 |
| R5 | App works offline with full CRUD | Must | SC2 |
| R6 | Auto-sync on reconnection | Must | SC2 |
| R7 | Conflict merge with visible audit log | Must | SC3 |
| R8 | Soft delete with 30-day recovery | Must | P1 resolved ambiguity |
| R9 | Share list via invite link/token | Must | Team use case |
| R10 | User authentication (email/password) | Should | Minimal auth |
| R11 | User presence indicators (who's viewing) | Could | Nice to have |
| R12 | Todo due dates and priorities | Could | Stretch feature |

### Non-Functional Requirements
| ID | Requirement | Target | MoSCoW |
|----|-------------|--------|--------|
| NFR1 | Latency: local ops <50ms | 50ms | Must |
| NFR2 | Latency: sync to other clients <200ms | 200ms | Must |
| NFR3 | Offline storage capacity | 1000 todos min | Must |
| NFR4 | Browser support | Last 2 versions | Must |
| NFR5 | Concurrent editors per list | Up to 10 | Must |
| NFR6 | Uptime (when online) | 99.5% | Should |

### Edge Cases
| Scenario | Expected Behavior | Priority |
|----------|-------------------|----------|
| EC1 | Two users edit same todo offline | Both edits merged, log shows both | Must |
| EC2 | User deletes todo, other edits it offline | Delete wins, editor gets conflict notice | Must |
| EC3 | User edits on phone offline, then laptop online | Both sets of changes merged correctly | Must |
| EC4 | Client offline >30 days | Queue full, show error, don't lose data | Must |
| EC5 | Server unreachable for hours | Continue offline, exponential retry | Must |
| EC6 | 11th user tries to join list | Show "list full" or queue | Should |

### CONSENT on requirements.
```

**Pi (Product Critic + Scalability):**
```markdown
### Functional Requirements
Agree with Claude's list. Additions:

| ID | Requirement | MoSCoW | Notes |
|----|-------------|--------|-------|
| R13 | Undo last action (local) | Should | Critical for user confidence |
| R14 | Bulk ops (delete completed) | Could | QoL feature |

### Non-Functional Requirements
Add:

| ID | Requirement | Target | MoSCoW |
|----|-------------|--------|--------|
| NFR7 | Bundle size for mobile | <200KB initial | Should |
| NFR8 | Battery efficiency on mobile | No busy-waiting sync | Should |
| NFR9 | Graceful degradation | Read-only if server down | Could |

### Edge Cases
Agree with Claude. Add:

| Scenario | Expected Behavior | Priority |
|----------|-------------------|----------|
| EC7 | List owner leaves (deletes account) | Transfer ownership or archive list | Should |
| EC8 | User opens app on 3rd device | Syncs from server, merges with local | Should |
| EC9 | Malformed data from client | Server validates, rejects with error | Must |

### CONFLICT:
R12 (due dates/priorities) — I think this is a SHOULD not COULD. Teams
need prioritization. Without it, it's just a notepad.

### CONSENT with additions and conflict noted.
```

**Codex (Integration + DevEx):**
```markdown
### Functional Requirements
Agree with Claude + Pi. Add:

| ID | Requirement | MoSCoW | Notes |
|----|-------------|--------|-------|
| R15 | Export list as JSON/Markdown | Could | Data portability |

### Non-Functional Requirements
Add:

| ID | Requirement | Target | MoSCoW |
|----|-------------|--------|--------|
| NFR10 | Local dev setup time | <5 minutes | Must |
| NFR11 | Hot reload in dev | Yes | Must |
| NFR12 | Self-documenting API | OpenAPI spec | Should |
| NFR13 | One-click deploy from main | CI/CD | Should |

### Edge Cases
Agree. Add:

| Scenario | Expected Behavior | Priority |
|----------|-------------------|----------|
| EC10 | Client clock is wrong | Server timestamp authoritative | Must |
| EC11 | Corrupted local storage | Clear and resync from server | Must |

### CONCERN: R12 (due dates/priorities) — I vote COULD. We can ship MVP
without it and add in week 7 if ahead of schedule.

### CONSENT.
```

---

### Facilitator Synthesis + Arbitration (P2 Artifact)

R12 conflict resolved: **Moved to SHOULD** (prioritization is important for team use, but can be simplified — just "high/medium/low" labels, not full calendar integration).

```markdown
# P2 Requirements — Collaborative Todo App

## Functional Requirements
| ID | Requirement | MoSCoW | Notes |
|----|-------------|--------|-------|
| R1 | Create/edit/delete todos | Must | |
| R2 | Create/edit/delete todo lists | Must | |
| R3 | Multi-user real-time edit on same list | Must | |
| R4 | Changes sync <200ms to other viewers | Must | |
| R5 | Full offline CRUD | Must | |
| R6 | Auto-sync on reconnection | Must | |
| R7 | Conflict merge with visible audit log | Must | |
| R8 | Soft delete + 30-day recovery | Must | |
| R9 | Share list via invite link | Must | |
| R10 | Email/password auth | Should | Minimal |
| R11 | User presence indicators | Could | |
| R12 | Todo priorities (high/medium/low) | Should | Simple labels, not dates |
| R13 | Undo last action | Should | |
| R14 | Bulk ops | Could | |
| R15 | Export list | Could | |

## Non-Functional Requirements
| ID | Requirement | Target | MoSCoW |
|----|-------------|--------|--------|
| NFR1 | Local op latency | <50ms | Must |
| NFR2 | Sync latency | <200ms | Must |
| NFR3 | Offline storage | 1000 todos | Must |
| NFR4 | Browser support | Last 2 versions | Must |
| NFR5 | Concurrent editors | Up to 10 | Must |
| NFR6 | Uptime | 99.5% | Should |
| NFR7 | Mobile bundle size | <200KB | Should |
| NFR8 | Battery efficiency | No busy-wait | Should |
| NFR9 | Dev setup time | <5 min | Must |
| NFR10 | Hot reload | Yes | Must |
| NFR11 | OpenAPI spec | Yes | Should |
| NFR12 | One-click deploy | CI/CD | Should |

## Edge Cases (11 total)
EC1-EC11 as documented by agents. Full table in requirements doc.

## Open Questions
- Due dates explicitly deferred to post-MVP (R12 covers only priorities)
```

### Phase Gate

**Facilitator:** "P2 COMPLETE. BLOCK check?"

- All agents: CONSENT (R12 resolved to facilitator's decision)

**Facilitator:** "APPROVED, proceed to Phase 3."

---

## Phase 3: Approach Debate (Roundtable)

### Facilitator → All Agents (P3 Prompt)

```markdown
# PHASE 3: Approach Debate
**Mode:** Roundtable
**Objective:** Propose and debate 2-3 architectural approaches
**Prior Approved Artifacts:** P1 Problem Statement, P2 Requirements
```

### Agent Responses

**Claude Code (Design Author):**
```markdown
### Approach 1: CRDT-Based Sync (My recommendation)
- Description: Use Yjs or Automerge for conflict-free replicated data types.
  Server acts as WebRTC/WebSocket relay. All clients hold full state.
- Pros: Natural merge behavior, proven libraries, handles offline seamlessly
- Cons: Larger bundle size (~50KB added), CRDT learning curve, all clients download all data
- Risks: CRDT memory overhead for 1000+ todos; need garbage collection for deleted items
- Best for: Real-time collaboration, offline support, automatic conflict resolution

### Approach 2: Operational Transformation (OT)
- Description: Server-centralized with OT algorithm (like Google Docs).
  Client sends ops, server transforms and broadcasts.
- Pros: Smaller client bundle, server controls truth, mature pattern
- Cons: Complex server implementation, harder to add offline support (need queuing + transform replay)
- Risks: OT bugs are catastrophic; need extensive testing; 8 weeks may be tight
- Best for: Server-controlled consistency, fine-grained permissions

### Approach 3: Event Sourcing + CQRS with Last-Write-Wins
- Description: Append-only event log. Server is source of truth.
  Clients replay events. Conflicts: LWW with vector clocks.
- Pros: Audit trail for free, simple server, scalable
- Cons: Not truly real-time (poll or SSE), complex client state reconstruction
- Risks: LWW loses data on true conflicts; doesn't meet R7 (merge with log)
- Best for: Audit-heavy systems, not real-time collaboration

### Trade-off Summary
| Criteria | CRDT | OT | Event Sourcing |
|----------|------|-----|----------------|
| Complexity | Med | High | Med |
| Offline Support | Excellent | Hard | Med |
| Time to MVP | 5-6 weeks | 7-8 weeks (risky) | 4-5 weeks |
| Maintainability | Med | Low (complex server) | Med |

### Recommendation: Approach 1 (CRDT)
8 weeks, 3 engineers. We need offline support (R5) and conflict merge (R7).
CRDT libraries handle both. OT is too risky on timeline.
Event sourcing doesn't solve real-time collaboration well.

### BLOCK on Approach 3: LWW violates R7 (visible conflict merge required).
```

**Pi (Product Critic + Scalability):**
```markdown
### Approach 1: CRDT-Based
Agree with Claude's analysis. On scalability:
- CRDTs scale reads well (all clients local), but server relay can bottleneck
- With max 10 editors and small todo items, relay won't be stressed
- Deleted items grow CRDT history — need explicit GC or tombstone limits

### Approach 2: OT
Agree — too complex for 8 weeks. If we had 12 weeks and 5 engineers, I'd reconsider.

### Approach 3: Event Sourcing
Partial agreement with Claude. LWW is bad, but we could use CRDT-style counters
within event sourcing (Lamport timestamps, merge functions).
Still, this is "reinventing CRDTs poorly."

### CONCERN on Approach 1:
- Bundle size: Yjs is ~40KB gzipped. With React/Vue app, we may exceed NFR7 (<200KB).
  We need to measure or consider a lighter CRDT (e.g., Yjs without provider bundles).
- All clients hold ALL data: For 10 editors, fine. But if lists grow to 500+ todos,
  initial sync is slow. Need pagination or lazy loading.

### My Ranking: 1 > 2 > 3. CONSENT on Approach 1 with noted concerns.
```

**Codex (Integration + DevEx):**
```markdown
### Approach 1: CRDT-Based
DevEx concern: Yjs has good docs but the ecosystem is still evolving.
Automerge has a Rust core (faster) but JS bindings are newer.
Factor in: which one has better TypeScript support? (Yjs wins today)

Integration concern: We need a WebSocket server. y-websocket is available
but we'd need a persistent backend for auth and long-term storage.
Consider architecture: Yjs for real-time sync + REST API for auth/persistence.

### Approach 2: OT
DevEx: Would require building custom OT library or adapting ShareJS/ShareDB.
ShareDB is mature but last updated 2 years ago. Risk of unmaintained deps.

### Approach 3: Event Sourcing
DevEx: Simplest server. Could build in a weekend.
Integration: SSE for real-time is simpler than WebSockets.
But as Claude said, real-time collaboration is poor.

### My Ranking: 1 > 3 > 2.
CONSENT on Approach 1 with a specific recommendation:
- Use Yjs for CRDT sync
- Use a thin Node.js/WebSocket server (y-websocket or custom)
- Use PostgreSQL for persistent snapshot + user auth
- Serve app with Vite (fast dev, good bundle analysis)
```

---

### Facilitator Synthesis (P3 Artifact)

```markdown
# P3 Selected Approach — Collaborative Todo App

## Approaches Considered
1. CRDT-Based Sync (Yjs) — selected
2. Operational Transformation — rejected (too complex for 8 weeks)
3. Event Sourcing + LWW — rejected (doesn't meet real-time + merge requirements)

## Selected: Approach 1 (CRDT-Based Sync with Yjs)

### Rationale
- Meets R5 (offline), R7 (conflict merge), and R4 (<200ms sync) natively
- 8-week timeline achievable (5-6 weeks estimated, leaves buffer)
- Mature library (Yjs) reduces custom code risk
- Team of 3 can divide: 1 frontend (CRDT client), 1 backend (WebSocket + DB), 1 shared (auth, integration, testing)

### Architecture Sketch
- Client: Yjs + WebSocket provider + local IndexedDB persistence
- Server: Node.js + y-websocket or custom WebSocket relay + PostgreSQL
- Auth: Minimal email/password via JWT
- Persistence: Server stores Yjs document updates as bytea in PostgreSQL
- Deployment: Railway/Render (free tier compatible)

### Risks Accepted
- Bundle size may exceed 200KB (will measure in P5, optimize if needed)
- CRDT memory growth from deleted items (need tombstone GC strategy)
- All clients download full list state (acceptable for 10 users × 1000 todos)

### Agent Consensus
- Claude Code: CONSENT (recommended approach)
- Pi: CONSENT with concerns noted (bundle size, pagination)
- Codex: CONSENT with tech stack recommendation (Yjs + Node + Postgres + Vite)
```

### Phase Gate

**Facilitator:** "P3 COMPLETE. BLOCK check?"

- Claude Code: CONSENT
- Pi: CONSENT (concerns noted)
- Codex: CONSENT

**Facilitator:** "APPROVED, proceed to Phase 4. Design Author, you're up."

---

## Phase 4: System Architecture (Author)

### Facilitator → Claude Code (P4 Design Author)

```markdown
# PHASE 4: System Architecture
**Mode:** Author
**Objective:** Draft the high-level system architecture
**Prior Approved Artifacts:** P1, P2, P3

## INPUT / CONTEXT
SELECTED APPROACH: CRDT-based sync with Yjs. Node.js WebSocket relay + PostgreSQL.
```

### Claude Code Response (P4 Draft)

```markdown
### High-Level Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │◄────►│   Server     │◄────►│  PostgreSQL │
│  (Browser)  │  WS  │  (Node.js)   │      │             │
└──────┬──────┘      └──────────────┘      └─────────────┘
       │
  ┌────┴────┐
  │ Yjs Doc │  ← CRDT document (todos + metadata)
  │ IndexedDB│  ← Offline persistence
  └─────────┘
```

### Data Flow (Real-Time Edit)
1. User A edits todo → local Yjs doc updates → IndexedDB persists
2. Yjs-websocket provider sends update binary to server
3. Server receives update → persists to PostgreSQL (async, non-blocking)
4. Server broadcasts update to all connected clients on same list
5. User B receives update → Yjs merges into local doc → UI re-renders

### Data Flow (Offline → Online)
1. User goes offline → Yjs doc continues updating in IndexedDB
2. Provider detects disconnect → marks pending updates
3. User reconnects → provider sends all pending updates to server
4. Server merges (Yjs handles automatically) → broadcasts to others
5. User's local state converges with server state

### API Contracts (High-Level)

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| /api/auth/register | POST | Create account | No |
| /api/auth/login | POST | Get JWT token | No |
| /api/lists | POST | Create new list | JWT |
| /api/lists/:id | GET | Get list metadata | JWT |
| /api/lists/:id/invite | POST | Generate share link | JWT (owner) |
| /api/lists/:id/join | POST | Join via invite token | JWT |
| /ws/:listId | WebSocket | Real-time sync | JWT (query param) |

### Technology Choices

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React + Vite | Fast dev, small bundle, team familiarity |
| CRDT | Yjs + y-websocket | Best-in-class CRDT, proven at scale |
| Offline storage | IndexedDB (via y-indexeddb) | Standard Web API, large quota |
| Backend | Node.js + ws library | Lightweight, y-websocket compatible |
| Database | PostgreSQL 15 | ACID for auth, bytea for Yjs updates |
| Auth | bcrypt + JWT | Minimal, no external dependencies |
| Hosting | Railway/Render | Free tier, easy deploy, PostgreSQL included |

### Architecture Decisions

| Decision | Context | Consequence |
|----------|---------|-------------|
| Yjs over Automerge | Mature ecosystem, better docs, TS support | Slightly larger bundle |
| Custom WS over y-websocket server | Need auth + persistence hooks | More backend code |
| PostgreSQL over SQLite/DynamoDB | ACID for auth, relational for metadata | Slightly higher latency |
| No client-side routing (SPA) | Simplest viable product | Harder to share direct links to lists |
```

---

### Facilitator → Reviewers (P4 Review)

**Pi (Scalability Engineer):**
```markdown
### BLOCK
- WebSocket broadcast to 10 clients per list: With 1000 lists active, that's
  10,000 concurrent connections. Node.js single-threaded event loop may struggle.
  Need: horizontal scaling strategy or worker threads for broadcast.

### CONCERN
- PostgreSQL async persistence: If DB is slow, broadcast is delayed.
  Options: (a) broadcast first, persist async (risk: data loss on crash)
          (b) buffer in memory, batch persist (complexity)
          (c) accept delay (simplest)
  Recommend (c) for MVP, document (a) or (b) for v2.

- No rate limiting on WebSocket: Client could flood updates.
  Add basic per-client rate limit (e.g., 100 updates/sec).

### QUESTIONS
- How large is a typical Yjs update binary? If 1KB per keystroke,
  10 users typing = 100KB/sec per list. Measure this.

### CONSENT with BLOCK on connection scaling.
```

**Codex (Integration Specialist):**
```markdown
### BLOCK (supporting Pi's)
- No horizontal scaling strategy documented. If we pick Railway, we get
  1 instance. What happens at 10,000 connections?

### CONCERN
- JWT in WebSocket query param: Logs may capture tokens.
  Better: connect to WS, then send auth message over secure connection.
  Or use HttpOnly cookie. Document this security risk.

- Invite link expiration: Not specified. Should expire in 7 days? 24 hours?
  Infinite links are a security risk.

- No API versioning: If we change API later, old clients break.
  Add `/api/v1/` prefix now, cheap to add later.

### QUESTIONS
- What's the migration strategy when we need to scale beyond Railway?
  Document a path to AWS/GCP with load balancers.

### CANNOT CONSENT until connection scaling is addressed.
```

---

### Backtrack to P4 Rework

**Facilitator:** "Valid BLOCKs on connection scaling. Claude, please address:"
1. Connection scaling: connection limits per instance, horizontal scaling note
2. Rate limiting on WS updates
3. JWT auth improvement (auth message vs query param)
4. API versioning
5. Invite link expiration

**Claude Code (revised P4):**
```markdown
### Scaling Strategy (Added)
- Per-instance limit: 2,000 concurrent WS connections (Node.js + ws lib)
- Exceeding: Deploy additional instances behind sticky-session load balancer
  (Railway Pro or migrate to AWS ALB with sticky sessions)
- Alternative: Redis Pub/Sub for cross-instance broadcast (v2)
- For MVP: Accept single-instance limit, document scaling path

### Rate Limiting (Added)
- Per-client: 100 updates/sec, sliding window
- Exceeding: Drop updates, client must debounce

### Auth Improvement (Revised)
- WS connection: No auth in query param
- Flow: (1) Connect WS, (2) Server sends "auth-required", (3) Client sends JWT over WS,
  (4) Server validates, (5) Client joins list rooms

### API Versioning (Added)
- All REST endpoints prefixed: `/api/v1/...`
- Deprecated endpoints: return 410 Gone with migration link

### Invite Links (Added)
- Default expiration: 7 days
- Max uses: Configurable, default 10
- Revocable: Owner can invalidate links
```

### Phase Gate (Round 2)

**Pi:** "Block resolved. CONSENT on revised architecture."
**Codex:** "Block resolved. CONSENT."

**Facilitator:** "APPROVED, proceed to Phase 5."

---

## Phase 5: Component Design (Author)

### Facilitator → Claude Code (P5 Design Author)

```markdown
# PHASE 5: Component Design
**Mode:** Author
**Objective:** Deep-dive into each component's internals
**Prior Approved Artifacts:** P1-P4
```

### Claude Code Response (P5 Draft — excerpt, full doc is longer)

```markdown
### Component: TodoStore (Client)
**Responsibility:** Manages Yjs document lifecycle, offline persistence, and sync state.

**Interface:**
```typescript
interface TodoStore {
  doc: Y.Doc                              // Yjs document root
  todos: Y.Map<Y.Map<Todo>>               // listId → todoId → Todo
  awareness: awarenessProtocol.Awareness  // User presence
  
  createTodo(listId: string, text: string): Todo
  updateTodo(listId: string, todoId: string, updates: Partial<Todo>): void
  deleteTodo(listId: string, todoId: string): void
  undo(): void                           // Local undo stack
  
  connect(listId: string, token: string): Promise<void>
  disconnect(): void
  getSyncState(): 'connected' | 'connecting' | 'disconnected' | 'synced'
}
```

**State:**
```
TodoStore {
  doc: Y.Doc
  provider: WebsocketProvider | null
  undoManager: Y.UndoManager
  syncState: 'connected' | 'connecting' | 'disconnected' | 'synced'
  pendingOps: UpdateBinary[]  // Queued when offline
}
```

**Dependencies:**
- Yjs: CRDT operations
- y-websocket: Network sync
- y-indexeddb: Offline persistence
- y-undo-plugin: Local undo

**Error Scenarios:**
| Error | Response | Log |
|-------|----------|-----|
| WS connection fail | Enter 'disconnected', queue in IndexedDB | `sync:disconnected` |
| IndexedDB full | Show error, offer export | `storage:quota_exceeded` |
| Merge conflict | Yjs auto-merges, log in audit trail | `sync:merged` |
| Invalid auth token | Disconnect, redirect to login | `auth:invalid_token` |
```

### Component: SyncServer (Server)
**Responsibility:** WebSocket relay, auth validation, persistent storage of Yjs updates.

**Interface:**
```typescript
interface SyncServer {
  handleConnection(ws: WebSocket): void
  joinList(ws: WebSocket, listId: string): void
  leaveList(ws: WebSocket, listId: string): void
  broadcast(listId: string, update: Uint8Array, exclude?: WebSocket): void
  persistUpdate(listId: string, update: Uint8Array): Promise<void>
}
```

**State:**
```
SyncServer {
  lists: Map<string, Set<WebSocket>>     // listId → active connections
  clients: Map<WebSocket, ClientMeta>     // ws → { userId, listIds }
  db: PostgreSQLPool
  rateLimiters: Map<string, TokenBucket>  // userId → bucket
}
```

**Dependencies:**
- ws library: WebSocket server
- pg: PostgreSQL client
- jsonwebtoken: JWT validation

**Error Scenarios:**
| Error | Response | Log |
|-------|----------|-----|
| DB write fail | Continue broadcast, retry DB async | `db:write_failed` |
| Auth fail | Close WS with 1008 (policy violation) | `auth:rejected` |
| Rate limit hit | Drop update, notify client | `rate:limit_exceeded` |
| Memory pressure | Close oldest inactive connections | `server:memory_pressure` |
```

### Data Models
```typescript
// Yjs document structure (client + server)
interface Todo {
  id: string
  text: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  createdAt: number  // epoch ms
  updatedAt: number
  deletedAt: number | null  // soft delete
  createdBy: string  // userId
}

// PostgreSQL tables
interface DBUser {
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

interface DBList {
  id: string
  name: string
  ownerId: string
  ydocState: Buffer  // Yjs updates as bytea
  updatedAt: Date
}

interface DBListMember {
  listId: string
  userId: string
  joinedAt: Date
  role: 'owner' | 'editor' | 'viewer'
}

interface DBInvite {
  token: string
  listId: string
  createdBy: string
  expiresAt: Date
  maxUses: number
  usedCount: number
}
```

### Sequence Diagram: Create Todo (Critical Path)
```
User -> TodoStore: createTodo("buy milk")
TodoStore -> Yjs: ymap.set(todoId, todoMap)
Yjs -> IndexedDB: persist update
TodoStore -> Provider: send update
Provider -> SyncServer: websocket send(Uint8Array)
SyncServer -> SyncServer: validate auth + rate limit
SyncServer -> PostgreSQL: INSERT ydoc update
SyncServer -> OtherClients: broadcast(exclude sender)
OtherClients -> Yjs: apply update
Yjs -> UI: observer callback → re-render
```
```

---

### Facilitator → Reviewers (P5 Review)

**Pi (Scalability):**
```markdown
### CONCERN
- TodoStore holds ALL lists in one Yjs doc? Or per-list docs?
  If one doc,memory grows unbounded. If per-list, need doc management.
  Recommend: Per-list Yjs doc, lazily loaded.

- PostgreSQL `ydocState` as Buffer: Whole document in one row.
  Lists with 1000 todos: could be 100KB+. Row updates on every keystroke
  =write amplification. Consider: append-only updates table, periodic snapshot.

### CONSENT with concerns.
```

**Codex (Integration):**
```markdown
### BLOCK
- API contract between TodoStore and SyncServer is implied, not explicit.
  What's the binary protocol? Yjs update format? Document it so
  third-party clients could theoretically be built.

### CONCERN
- No migration strategy for Yjs doc schema changes.
  If we add a field to Todo (e.g., `dueDate` in v2), old docs need upgrade.
  Add schema version in Yjs doc root.

### QUESTIONS
- What's the cleanup strategy for soft-deleted todos in Yjs CRDT?
  Tombstones accumulate forever. Need periodic GC or archive.

### CONSENT with BLOCK on protocol documentation.
```

---

### Backtrack to P5 Rework

**Claude Code (revised P5):**
```markdown
### TodoStore Revision
- Per-list Yjs docs, managed by `ListManager` component
- Lazy load: load doc from IndexedDB or server on list open
- Unload: after 5 min inactive, sync and free from memory

### Persistence Revision
- DB schema: Split `lists.ydocState` into `list_updates` append-only table:
  ```sql
  CREATE TABLE list_updates (
    id SERIAL PRIMARY KEY,
    list_id UUID REFERENCES lists(id),
    update_data BYTEA NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  CREATE INDEX idx_list_updates_list ON list_updates(list_id, created_at);
  ```
- Periodic snapshot: Every 100 updates, compact into `lists.ydoc_snapshot`

### Protocol Documentation (Added)
```
WebSocket Binary Protocol
- Frame 1 byte: 0x01 = Yjs update, 0x02 = auth, 0x03 = awareness
- Followed by length-prefixed payload
```

### Schema Version (Added)
- Yjs doc root: `doc.getMap('meta').set('schemaVersion', 1)`
- Migration: On load, check version, apply transforms if needed
```

### Phase Gate (Round 2)

**Pi:** "Concern addressed. CONSENT."
**Codex:** "Block resolved. CONSENT."

**Facilitator:** "APPROVED, proceed to Phase 6."

---

## Phase 6: Error Handling & Edge Cases (Author)

### Facilitator → Claude Code (P6)

```markdown
# PHASE 6: Error Handling & Edge Cases
**Mode:** Author
**Objective:** Design failure modes, recovery, and observability
**Prior Approved Artifacts:** P1-P5
```

### Claude Code Response (excerpts)

```markdown
### Failure Modes Matrix
| Component | Failure | Impact | Detection | Response | Recovery |
|-----------|---------|--------|-----------|----------|----------|
| Client WS | Disconnect | User sees offline badge | onclose event | Queue in IndexedDB | Auto-reconnect expo backoff |
| Client IDB | Quota exceeded | Can't save new todos | QuotaError | Show warning, offer export | User clears space or exports |
| Client merge | Conflict (auto) | None visible | Yjs observer | Log in audit panel | N/A (automatic) |
| Server DB | Write timeout | Update not persisted | pg timeout | Retry 3x, log | Alert on retry exhaustion |
| Server mem | >80% heap | Slowdown/crashes | process.memoryUsage() | Close stale connections | Scale up or restart |
| Network | Latency >5s | Sync feels slow | RTT measurement | Show "syncing..." spinner | N/A |

### Retry Strategies
| Component | Strategy | Parameters |
|-----------|----------|------------|
| WS reconnect | Exponential backoff | base=1s, max=30s, jitter=±20% |
| DB writes | Retry with backoff | 3 attempts, 100ms/500ms/2000ms |
| IDB operations | Immediate retry once | 1 retry, then show error |

### Observability Plan
- **Metrics:** sync_latency_ms, ws_connections, db_write_errors, idb_quota_pct
- **Logs:** Structured JSON, levels: error/warn/info/debug
- **Traces:** No distributed tracing (MVP), log correlation via requestId
- **Alerts:** PagerDuty/webhook on db_write_errors >10/min or memory >85%

### Recovery Procedures
- **Client corrupted state:** Clear IndexedDB, re-sync from server
- **Server crash:** Restart, restore lists from DB snapshots + replay updates
- **Split brain (two offline edits):** Yjs CRDT converges automatically, audit log shows merge
```

### Reviewers: Pi & Codex → CONSENT (no blocks)

**Facilitator:** "APPROVED, proceed to Phase 7."

---

## Phase 7: Testing & Validation Strategy (Author)

### Facilitator → Codex as QA Lead (P7)

```markdown
# PHASE 7: Testing & Validation Strategy
**Mode:** Author (QA Lead)
**Objective:** Design the complete test and validation approach
**Prior Approved Artifacts:** P1-P6
```

### Codex Response

```markdown
### Test Pyramid
| Layer | Scope | Tools | Coverage Target |
|-------|-------|-------|-----------------|
| Unit | CRDT ops, auth logic | Vitest (fast) | 80% |
| Integration | WS sync, DB persistence | testcontainers + ws client | Critical paths |
| E2E | User flows: create, edit, offline, invite | Playwright | Core journeys |
| Contract | REST API schemas | Zod + supertest | All endpoints |
| Performance | 10 concurrent editors | k6 or custom script | <200ms sync |

### Per-Component Test Plan
| Component | Unit | Integration | E2E | Notes |
|-----------|------|-------------|-----|-------|
| TodoStore | ✅ CRUD, undo, conflict | ✅ sync with mock server | Via E2E | Mock Yjs provider |
| SyncServer | ✅ rate limit, auth | ✅ multi-client sync | Via E2E | Testcontainers PG |
| AuthService | ✅ hash, JWT | ✅ login flow | Via E2E | Mock DB for unit |

### CI/CD Gates
| Gate | Checks |
|------|--------|
| PR | Unit + typecheck + lint |
| Merge | Integration + contract tests |
| Deploy | E2E smoke tests |

### Key E2E Scenarios
1. Two browsers edit same list simultaneously
2. Offline in one browser, online in other, reconnect
3. Invite link flow: generate → share → join → edit
4. 10 concurrent editors, measure sync latency

### Validation Matrix
| Requirement | Test | Status |
|-------------|------|--------|
| R4: <200ms sync | perf/concurrent-edit.spec.ts | Covered |
| R5: Offline CRUD | e2e/offline-sync.spec.ts | Covered |
| R7: Conflict merge | e2e/conflict-merge.spec.ts | Covered |
| NFR5: 10 editors | perf/load-10-editors.spec.ts | Covered |
```

### Reviewers: Claude Code (Design Author) → CONSENT, Pi → CONSENT

**Facilitator:** "APPROVED, proceed to Phase 8 — Final Consensus."

---

## Phase 8: Consensus & Finalization (Roundtable)

### Facilitator → All Agents (P8)

```markdown
# PHASE 8: Consensus & Finalization
**Mode:** Roundtable
**Objective:** Review full design document, raise final objections
**Prior Approved Artifacts:** P1-P7 (all approved)
```

### Agent Responses

**Claude Code:**
```markdown
### Section-by-Section Review
| Section | Status | Notes |
|---------|--------|-------|
| P1 Problem | CONSENT | Resolved ambiguities worked well |
| P2 Requirements | CONSENT | R12 conflict resolved fairly |
| P3 Approach | CONSENT | CRDT choice validated by later phases |
| P4 Architecture | CONSENT | Scaling strategy added addresses concerns |
| P5 Components | CONSENT | Per-list docs + append-only DB is right |
| P6 Error Handling | CONSENT | Observability plan is minimal but adequate |
| P7 Testing | CONSENT | Coverage looks complete |

### FINAL CONSENT. Design is ready for implementation.
```

**Pi:**
```markdown
### Section-by-Section Review
| Section | Status | Notes |
|---------|--------|-------|
| P1-P3 | CONSENT | |
| P4 | CONSENT | Connection scaling strategy is acceptable for MVP |
| P5 | CONSENT | Append-only updates table addresses write amplification |
| P6 | CONCERN | Observability is thin — only 4 metrics. Add todo_operation_count,
  list_active_users, invite_usage_rate before production? OK for MVP.
| P7 | CONSENT | |

### FINAL CONSENT with P6 concern documented.
```

**Codex:**
```markdown
### Section-by-Section Review
| Section | Status | Notes |
|---------|--------|-------|
| P1-P5 | CONSENT | |
| P6 | CONSENT | |
| P7 | CONSENT | One suggestion: add a test for EC10 (wrong client clock).
  Not blocking.

### FINAL CONSENT. Design is implementable.
```

---

### Facilitator Finalization

**Facilitator:** "All agents have CONSENTED. P8 COMPLETE. The design is LOCKED."

**Facilitator runs readiness check:**
```bash
$ ./scripts/check-readiness.sh todo-app-design.md
✅ All required sections present.
```

---

## Final Design Document

The complete 8-section design document has been assembled from all phase artifacts. It includes:

1. **Problem Statement** — User intent, constraints, success criteria, anti-requirements
2. **Requirements** — 15 functional, 12 non-functional, 11 edge cases (MoSCoW prioritized)
3. **Selected Approach** — CRDT-based sync with Yjs (rejected OT and Event Sourcing)
4. **System Architecture** — Client Yjs + IndexedDB, Node.js WS relay, PostgreSQL, auth, scaling strategy
5. **Component Design** — TodoStore, SyncServer, ListManager, AuthService with interfaces, state, errors
6. **Error Handling** — Failure modes matrix, retry strategies, observability plan, recovery procedures
7. **Testing Strategy** — Unit/Integration/E2E/Contract/Performance, CI gates, validation matrix
8. **Consensus Record** — All 3 agents CONSENTED, Pi's P6 concern documented for v2

**Ready for implementation.** A developer with zero context could:
- Read Section 5 to understand every component's interface
- Read Section 7 to know what tests to write
- Implement incrementally: auth → CRDT client → WS server → UI

---

## Post-Workshop Notes

- **Blocks raised:** 3 (P4 connection scaling, P4 auth/protocol, P5 API documentation)
- **Backtracks:** 2 (P4, P5)
- **Concerns documented:** 2 (Pi's bundle size/P6 observability, Codex's clock edge case)
- **Total time:** 2 hours 47 minutes
- **Facilitator overhead:** ~15 minutes synthesizing per phase
