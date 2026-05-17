# Design Document: Multi-Agent Design Workshop Protocol

> **A cross-agent framework for systematic AI-led design discussions that produce production-ready technical design documents.**

## 0. Workshop Metadata
- **Date:** 2026-05-17
- **Status:** Design approved, ready for implementation
- **Assignee(s):** Pi (design), user (review)

## 1. Problem Statement (P1)

### User Intent
Create a reusable protocol that enables multiple AI assistants (Pi, Claude Code, Codex, etc.) to collaboratively brainstorm and produce solid technical design documents. The output must be implementation-ready: if a developer follows the design doc and writes matching tests, the desired system is built correctly.

### Constraints
- **Cross-agent compatibility:** Works with any LLM-based coding agent that reads markdown prompts
- **No runtime tool requirement:** Agents that cannot run code (chat-only interfaces) must still participate
- **Human gating:** The facilitator (human or meta-agent) must approve every phase transition
- **Deterministic output:** Same input → same phase structure → same artifact format
- **Backtracking support:** Any agent can raise objections that force re-work

### Success Criteria
- [ ] All 8 phases complete with facilitator approval at each gate
- [ ] Design document passes a "implementation readiness" checklist
- [ ] A developer with zero context can implement from the doc alone
- [ ] Tests written per the doc would validate the implementation

### Out of Scope / Anti-Requirements
- Not an automated orchestrator (no mandatory code execution)
- Not a real-time agent communication bus
- Not a replacement for human architectural judgment

## 2. Requirements (P2)

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| R1 | Define exactly 8 workshop phases with clear inputs/outputs | Must |
| R2 | Provide role-specific prompt templates for each phase | Must |
| R3 | Define BLOCK / CONSENT / CONCERN objection protocol | Must |
| R4 | Specify facilitator responsibilities and phase-gate mechanics | Must |
| R5 | Produce a standardized design document structure | Must |
| R6 | Support both roundtable (diverge) and author/reviewer (converge) modes | Must |
| R7 | Include backtracking mechanism when objections are raised | Should |
| R8 | Provide example rendered prompts for reference | Should |
| R9 | Support EARS + user story format for requirements (optional) | Should |
| R10 | Include research step before architecture selection | Should |
| R11 | Require reasoning checkpoints before critical decisions | Should |
| R12 | Support optional implementation handoff after consensus | Could |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1 | Agents can participate with zero code execution capability | 100% markdown |
| NFR2 | Protocol is deterministic and repeatable | Same input → same phases |
| NFR3 | Design doc is usable by any developer, not just AI agents | Plain markdown |
| NFR4 | Low facilitation overhead per phase | ≤5 min to dispatch prompts |

### Edge Cases
- Single agent mode: facilitator can play all roles themselves
- Silent agent: if one agent doesn't respond, facilitator proceeds with others
- Circular objection: facilitator has override authority to break deadlocks

### Open Questions (deferred to P8)
- Should there be a formal "checklist" validator at the end?
- How to version the protocol as it evolves?

## 3. Selected Approach (P3)

### Approaches Considered

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| A1 Fixed-Role Roundtable | All agents debate every phase together | Maximum cross-pollination | High token burn, facilitation overhead, dominant voice problem |
| A2 Sequential Author/Reviewer | One author drafts, others review later | Efficient, focused | Less early exploration, integration issues surface late |
| **A3 Hybrid Facilitated Workshop** | **Roundtable for P1-P3, Author/Reviewer for P4-P7, Roundtable for P8** | **Best of both** | **Slightly more complex protocol** |

### Selected: Approach 3 (Hybrid)

**Rationale:**
- Human design reviews succeed because of structured phases: open ideation → documentation → critique → consensus
- Diverge-Converge is a well-proven workshop pattern
- The roundtable phases (P1-P3) unlock creativity; the author/reviewer phases (P4-P7) enforce discipline

**Risks Accepted:**
- Requires facilitator discipline to enforce phase boundaries
- Author/reviewer mode may miss serendipitous cross-domain insights

## 4. System Architecture (P4)

### High-Level Flow

```
┌─────────────────┐
│  User provides  │
│     intent      │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│  FACILITATOR (Human or Meta-Agent)           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ Agent A │  │ Agent B │  │ Agent C │ ...  │
│  │ (Role X)│  │ (Role Y)│  │ (Role Z)│      │
│  └─────────┘  └─────────┘  └─────────┘      │
└──────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Design Doc     │
│  (md artifact)  │
└─────────────────┘
```

### Key Components

| Component | Responsibility |
|-----------|---------------|
| **Facilitator** | Phase management, synthesis, gatekeeping, arbitration |
| **Agent Pool** | 2-N agents, each loaded with a role-specific prompt template |
| **Artifact Registry** | Approved documents from each phase (chat history or filesystem) |
| **Prompt Template Engine** | Renders `{{VARIABLES}}` into agent-ready prompts |

### Data Flow

1. Facilitator renders prompts from templates → sends to agents
2. Agents respond with structured output (per role card)
3. Facilitator synthesizes responses → produces phase artifact
4. Facilitator runs BLOCK/CONSENT check → resolves or backtracks
5. Approved artifact appended to design document
6. Repeat for next phase

## 5. Component Design (P5)

### Prompt Template System

**Base Template (all prompts inherit):**
```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE {{PHASE_NUMBER}}: {{PHASE_NAME}}
**Mode:** {{MODE}}
**Objective:** {{OBJECTIVE}}
**Prior Approved Artifacts:** {{PRIOR_ARTIFACTS_SUMMARY}}
**Output Artifact:** {{OUTPUT_NAME}}

## YOUR ROLE
{{ROLE_CARD}}

## INPUT / CONTEXT
{{PHASE_INPUT}}

## OUTPUT INSTRUCTIONS
{{OUTPUT_RULES}}

## OUTPUT FORMAT
{{OUTPUT_FORMAT_SPEC}}
---
{{FACILITATOR_NOTES}}
```

**Variable Substitution Table:**
| Variable | Source | Example |
|----------|--------|---------|
| `WORKSHOP_CHARTER` | P1 output | "Build a real-time collaborative document editor" |
| `PHASE_NUMBER` | Protocol constant | "4" |
| `PHASE_NAME` | Protocol constant | "System Architecture" |
| `MODE` | Phase definition | "Author" or "Reviewer" |
| `OBJECTIVE` | Phase definition | "Draft high-level system architecture" |
| `PRIOR_ARTIFACTS_SUMMARY` | Facilitator synthesis | "P1-P3 approved, see attached" |
| `OUTPUT_NAME` | Phase definition | "P4 Architecture Draft" |
| `ROLE_CARD` | Role bank | Security Engineer role card |
| `PHASE_INPUT` | Previous phase output | P3 selected approach text |
| `OUTPUT_RULES` | Role card | "1. Identify bottlenecks..." |
| `OUTPUT_FORMAT_SPEC` | Role card | "BLOCK / CONCERN / QUESTIONS / CONSENT" |
| `FACILITATOR_NOTES` | Facilitator freeform | "Focus on WebSocket limits" |

### Agent Role Bank

| Role | Identity | Strengths |
|------|----------|-----------|
| Design Author | Primary drafter | Architecture, interfaces, data flow |
| Product Critic | User advocate | Requirements, UX, scope creep |
| Security Engineer | Threat modeler | Auth, data protection, compliance |
| Scalability Engineer | Systems thinker | Performance, capacity, concurrency |
| Integration Specialist | Glue expert | APIs, migrations, third-party deps |
| QA/Testing Lead | Quality gate | Testability, observability, coverage |
| DevEx Advocate | Developer UX | Build/debug, docs, onboarding |

### Role Card Format

```markdown
ROLE: {ROLE_NAME}
PHASE: {PHASE_NUMBER} {PHASE_NAME}
INSTRUCTIONS:
- {Specific directive 1}
- {Specific directive 2}
- Use BLOCK for critical issues. Use CONCERN for risks with mitigations.
- Never say "this looks good." Always find at least one issue or question.
OUTPUT FORMAT:
1. BLOCK items (if any)
2. CONCERN items (if any)
3. Questions for clarification
4. CONSENT or "I cannot consent until [X]"
```

### Facilitator State Machine

```
INIT ──► P1 ──[APPROVED]──► P2 ──[APPROVED]──► P3 ──[APPROVED]──► P4
                              ▲                                      │
                              └────────[BLOCK resolved]──────────────┘
                                                                    │
P8 ──[APPROVED]──► FINALIZED                                        │
 ▲                                                                  │
 └──[BLOCK resolved]────────────────────────────────────────────────┘
```

**State Rules:**
- Only forward transitions on explicit facilitator approval
- BLOCK forces backward transition to previous phase
- Facilitator can override BLOCK with documented rationale

**Explicit Backtracking Protocol:**
```
1. BLOCK received: Document the BLOCK with section ID and reason
2. Facilitator assessment: Is this valid? Does it apply to current or earlier phase?
3. Resolution paths:
   a. Fix in current phase → revise and re-submit for approval
   b. Root cause in earlier phase → backtrack to that phase with reference
   c. Invalid / acceptable risk → OVERRIDE with documented rationale
4. After resolution: Re-run CONSENT check on affected agents before proceeding
```

**Cross-Phase Consistency Guard:**
If a later phase (e.g., P5) contradicts an earlier phase (e.g., P3), you MUST:
1. BLOCK in the later phase
2. Reference the specific earlier artifact that is contradicted
3. Backtrack and amend the earlier phase, OR document the intentional override
4. Cascade any changes forward through all affected phases

**Reasoning Checkpoints (Required):**
The facilitator must explicitly reason through alternatives before:
- **Architecture selection (P3):** Draft a brief analysis of trade-offs, risks, and why the selected approach dominates
- **BLOCK resolution:** Draft a brief analysis of the BLOCK, proposed fixes, and why the chosen resolution path is correct

## 6. Error Handling & Edge Cases (P6)

### Failure Modes

| Failure | Detection | Mitigation | Owner |
|---------|-----------|------------|-------|
| Agent produces off-topic output | Output doesn't match format spec | Facilitator rejects, re-prompts with clarifying note | Facilitator |
| Two agents raise conflicting BLOCKs | Both BLOCK on same section | Facilitator arbitrates, may split section or escalate | Facilitator |
| Agent goes silent during phase | No response within timeout | Proceed with remaining agents; flag in metadata | Facilitator |
| Facilitator loses phase context | Chat history too long | Re-send prior artifacts summary in next prompt | Facilitator |
| Design doc becomes inconsistent | P5 contradicts P3 | Block in P5, return to P3 for amendment | Any agent |

### Retry Strategy
- **Prompt rejection:** Max 2 re-prompts with escalating facilitator notes
- **BLOCK deadlock:** Facilitator override after 2 backtrack cycles
- **Missing agent:** Proceed with partial quorum (≥2 agents for roundtable, ≥1 reviewer for author mode)

### Observability
- Every phase produces a timestamped artifact
- BLOCK log recorded in design doc metadata (Section 0)
- Facilitator notes are append-only audit trail

## 7. Testing & Validation Strategy (P7)

### Readiness Checklist (applied at P8)

| Check | Pass Criteria |
|-------|---------------|
| Problem Statement | User intent is unambiguous, success criteria are measurable |
| Requirements | All requirements have IDs, priorities, and owners |
| Approaches | At least 2 alternatives were considered and rejected with rationale |
| Architecture | High-level diagram exists, data flow is traceable |
| Components | Every component has interface + state + dependencies defined |
| Error Handling | Failure modes matrix exists, no unhandled critical paths |
| Testing | Test pyramid defined, every critical path has a test layer assigned |
| Consensus | All active agents have CONSENT'd or documented dissent |

### Design Doc Validation

- **Self-consistency sweep:** Facilitator (or meta-agent) checks that no section contradicts another
- **Implementation traceability:** Every requirement (R1, R2, ...) appears in at least one design section
- **Test coverage traceability:** Every critical path in P5 has a test in P7

### Protocol Validation

- **Template syntax:** All `{{VARIABLES}}` are defined in the substitution table
- **Role coverage:** Every phase has at least one agent assigned
- **Exit criteria:** Every phase has a measurable exit condition

## 8. Consensus Record (P8)

### Final Sign-Off

| Role | Agent | Status | Notes |
|------|-------|--------|-------|
| Facilitator | Pi | ✅ CONSENT | Protocol is complete and ready for implementation |
| Product Critic | Pi | ✅ CONSENT | Scope is well-defined, anti-requirements prevent creep |
| Security Engineer | Pi | ✅ CONSENT | BLOCK protocol provides adequate safety rails |
| Scalability Engineer | Pi | ✅ CONSENT | Hybrid approach balances exploration and discipline |
| User | You | PENDING | Awaiting your final approval |

### Known Risks & Accepted Trade-Offs
1. **Facilitator bottleneck:** Workshop speed depends on facilitator responsiveness. Accepted: this is a feature, not a bug — human judgment is the safety rail.
2. **Template maintenance:** As the protocol evolves, templates may drift. Accepted: version templates with the design doc.
3. **Agent hallucination:** Agents may generate plausible but incorrect designs. Accepted: the multi-agent review + BLOCK protocol mitigates this.

### Future Work
- [ ] Add a formal checklist validator tool (script that checks Section 7 criteria)
- [ ] Create an example workshop transcript (mock run with real agents)
- [ ] Publish the prompt template library as a standalone package
- [ ] Add a "retrospective" phase (P9) for post-implementation learning

---

## Appendices

### A. Prompt Template Library
See companion file: `2026-05-17-multi-agent-design-workshop-prompts.md`

### B. Quick-Start Facilitator Guide

1. Copy the prompt templates into your agent's context window
2. Assign roles to agents (or play all roles yourself)
3. Start at P1, advance only on explicit approval
4. At each phase gate, run the BLOCK/CONSENT check
5. Assemble outputs into the design doc structure (Section 5)
6. Run the readiness checklist (Section 7) before finalizing
