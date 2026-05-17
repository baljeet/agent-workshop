# Multi-Agent Design Workshop — Prompt Template Library

> Companion to: `2026-05-17-multi-agent-design-workshop-protocol.md`

## How to Use These Templates

1. Copy a template block into your agent's context window
2. Replace all `{{VARIABLE}}` placeholders with actual content
3. Add facilitator notes at the bottom
4. Send to agent

---

## Template: Workshop Charter (Initial Prompt)

Use this to kick off the workshop with all agents.

```markdown
WORKSHOP CHARTER
================
We are conducting a structured multi-agent design workshop.

PROJECT: {{PROJECT_NAME}}
GOAL: {{ONE_SENTENCE_GOAL}}

FACILITATOR: {{FACILITATOR_NAME}}
AGENTS PARTICIPATING: {{AGENT_NAMES}}

PROTOCOL RULES:
1. We work in 8 phases. We NEVER skip phases.
2. Each phase ends when the FACILITATOR says "APPROVED, proceed to Phase N+1."
3. Any agent may raise:
   - BLOCK: [section] — [critical issue, halts progress]
   - CONCERN: [section] — [non-blocking risk]
   - CONSENT: [section] — [endorsement]
4. The facilitator synthesizes all outputs into a single artifact per phase.
5. All outputs follow the specified format. Off-format responses will be rejected.

YOUR ROLE IN THIS WORKSHOP: {{INITIAL_ROLE_ASSIGNMENT}}

We begin with PHASE 1: Problem Framing.
```

---

## Phase 1: Problem Framing (Roundtable)

### P1 — All Agents

```markdown
{{WORKSHOP_CHARTER}}
---
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
{{USER_INTENT_TEXT}}

KNOWN CONTEXT:
{{PROJECT_FILES_OR_NOTES}}

## OUTPUT FORMAT
### Problem Summary
[One-paragraph summary of what we're building and why]

### Constraints
- Hard: [cannot be violated]
- Soft: [should respect but can negotiate]

### Success Criteria
- [Criterion 1, measurable]
- [Criterion 2, measurable]

### Anti-Requirements (Out of Scope)
- [What we are NOT building]

### Ambiguities / Questions
- [What needs clarification before we proceed?]

### CONSENT or CONCERN: [your verdict on whether this problem is sufficiently defined]
```

---

## Phase 2: Requirements Elicitation (Roundtable)

### P2 — All Agents

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 2: Requirements Elicitation
**Mode:** Roundtable
**Objective:** Extract complete requirements from the problem statement
**Prior Approved Artifacts:** P1 Problem Statement
**Output Artifact:** P2 Requirements Document

## YOUR ROLE
ROLE: {{ASSIGNED_ROLE}}
INSTRUCTIONS:
- Review the approved problem statement
- Extract ALL requirements: functional, non-functional, edge cases
- Prioritize using MoSCoW (Must / Should / Could / Won't)
- Identify conflicts between requirements
- For each edge case: describe the scenario and expected behavior
- Do NOT design solutions. Extract what the system MUST do.

**Requirement Format:**
Each functional requirement may be written as:
1. **MoSCoW table entry** (default, for simple requirements)
2. **User Story + EARS acceptance criteria** (recommended for behavioral requirements)

User Story format: *"As a [role], I want [feature], so that [benefit]"*

EARS (Easy Approach to Requirements Syntax): unambiguous, testable acceptance criteria
- `WHEN [event] THEN [system] SHALL [response]` — stimulus triggers response
- `IF [precondition] THEN [system] SHALL [response]` — guard condition
- `WHEN [event] AND [condition] THEN [system] SHALL [response]` — stimulus with guard
- `WHILE [state] THEN [system] SHALL [response]` — continuous behavior

Use User Story + EARS for user-facing features. Use MoSCoW tables for technical constraints.

## INPUT / CONTEXT
APPROVED PROBLEM STATEMENT (P1):
{{P1_ARTIFACT}}

## OUTPUT FORMAT
### Functional Requirements

**Option A: MoSCoW Table (for well-understood, atomic requirements)**

| ID | Requirement | MoSCoW | Notes |
|----|-------------|--------|-------|
| R1 | [description] | Must | |

**Option B: User Story + EARS (for behavioral / user-facing requirements)**

```
### R1: [Short Feature Name]
**User Story:** As a [role], I want [feature], so that [benefit]

**Acceptance Criteria (EARS):**
1. WHEN [event] THEN [system] SHALL [response]
2. IF [precondition] THEN [system] SHALL [response]

**MoSCoW:** Must | **Notes:** [any constraints]
```

Use Option B for user-facing features. Use Option A for technical constraints.

### Non-Functional Requirements
| ID | Requirement | Target | MoSCoW |
|----|-------------|--------|--------|
| NFR1 | [description] | [metric] | Must |

### Edge Cases
| Scenario | Expected Behavior | Priority |
|----------|-------------------|----------|
| [describe] | [behavior] | Must |

### Conflicts / Trade-offs
- [Requirement X conflicts with Y because...]

### Open Questions (defer to later phases)
- [Question that doesn't block requirements]

### BLOCK / CONCERN / CONSENT on requirements completeness
```

---

## Phase 3: Approach Debate (Roundtable)

### P3 — All Agents

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 3: Approach Debate
**Mode:** Roundtable
**Objective:** Propose and debate 2-3 architectural approaches
**Prior Approved Artifacts:** P1 Problem Statement, P2 Requirements
**Output Artifact:** P3 Selected Approach

## YOUR ROLE
ROLE: {{ASSIGNED_ROLE}}
INSTRUCTIONS:
- Propose 2-3 distinct architectural approaches to meet ALL Must-have requirements
- **Before proposing, research:** existing solutions, patterns, and constraints relevant to the domain. Cite any sources or precedents you reference.
- For each approach: describe it, list pros/cons, identify risks
- Debate the approaches: challenge other agents' proposals constructively
- Consider: complexity, maintainability, scalability, team expertise, time to market
- Do NOT commit to one approach. Present alternatives honestly.

## INPUT / CONTEXT
APPROVED PROBLEM STATEMENT (P1):
{{P1_SUMMARY}}

APPROVED REQUIREMENTS (P2):
{{P2_SUMMARY}}

## OUTPUT FORMAT
### Approach 1: [Name]
- Description: [2-3 sentences]
- Pros: [list]
- Cons: [list]
- Risks: [list]
- Best for: [which requirements it excels at]

### Approach 2: [Name]
[same structure]

### Approach 3: [Name] (if applicable)
[same structure]

### Trade-off Summary
| Criteria | Approach 1 | Approach 2 | Approach 3 |
|----------|------------|------------|------------|
| Complexity | High/Med/Low | | |
| Scalability | | | |
| Time to MVP | | | |
| Maintainability | | | |

### Your Recommendation
- I recommend Approach [N] because...
- I would BLOCK Approach [N] if...

### BLOCK / CONCERN / CONSENT on each approach
```

---

## Phase 4: System Architecture (Author)

### P4 — Design Author

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 4: System Architecture
**Mode:** Author
**Objective:** Draft the high-level system architecture
**Prior Approved Artifacts:** P1, P2, P3 (selected approach)
**Output Artifact:** P4 Architecture Draft

## YOUR ROLE
ROLE: Design Author
INSTRUCTIONS:
- You are the PRIMARY DRAFTER. Write the architecture section of the design doc.
- Based on the SELECTED approach, design: components, data flow, API contracts, tech stack
- Use mermaid/plantUML/text diagrams. Be specific, not vague.
- Every component must have a clear responsibility and interface.
- Do NOT go into component internals yet (that's Phase 5).

## INPUT / CONTEXT
SELECTED APPROACH (P3):
{{P3_SELECTED_APPROACH}}

REQUIREMENTS TO SATISFY (P2):
{{P2_REQUIREMENTS_RELEVANT_TO_ARCHITECTURE}}

## OUTPUT FORMAT
### High-Level Architecture
```
[diagram in text/mermaid]
```

### Data Flow
1. [Step 1]
2. [Step 2]

### API Contracts (high-level)
| Endpoint / Method | Purpose | Input | Output |
|-------------------|---------|-------|--------|
| GET /api/x | | | |

### Technology Choices
| Layer | Technology | Rationale |
|-------|------------|-----------|
| DB | PostgreSQL | ACID compliance for financial data |

### Architecture Decisions
| Decision | Context | Consequence |
|----------|---------|-------------|
| Use Kafka for events | High throughput | Adds operational complexity |

### Known Open Issues
- [defer to later phase]
```

### P4 — Reviewers (Security / Scalability / Product)

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 4: System Architecture Review
**Mode:** Reviewer
**Objective:** Challenge the proposed architecture
**Prior Approved Artifacts:** P1, P2, P3, P4 Draft
**Output Artifact:** P4 Architecture Review

## YOUR ROLE
ROLE: {{REVIEWER_ROLE}} (Security Engineer / Scalability Engineer / Product Critic)
INSTRUCTIONS:
- Review the architecture draft. Your job is NOT to rewrite it.
- {{SECURITY}}: Identify threat surfaces, auth gaps, data exposure, compliance risks
- {{SCALABILITY}}: Identify bottlenecks, resource limits, concurrency issues, single points of failure
- {{PRODUCT}}: Check if user needs are met, flag missing features, UX gaps, scope creep
- Use BLOCK for critical issues. Use CONCERN for risks with proposed mitigations.
- Always find at least one issue or question. Never rubber-stamp.

## INPUT / CONTEXT
ARCHITECTURE DRAFT (P4):
{{P4_DRAFT}}

## OUTPUT FORMAT
### BLOCK
- [Critical issue that must be fixed before proceeding]

### CONCERN
- [Risk with proposed mitigation]

### QUESTIONS
- [What needs clarification?]

### CONSENT STATUS
- CONSENT | CANNOT CONSENT until [X] is addressed
```

---

## Phase 5: Component Design (Author)

### P5 — Design Author

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 5: Component Design
**Mode:** Author
**Objective:** Deep-dive into each component's internals
**Prior Approved Artifacts:** P1-P4
**Output Artifact:** P5 Component Specifications

## YOUR ROLE
ROLE: Design Author
INSTRUCTIONS:
- For EACH component identified in P4, specify:
  - Responsibility (single sentence)
  - Interface (methods/functions/events it exposes)
  - Internal state (data structures, state machine)
  - Dependencies (what it needs from other components)
  - Error scenarios (how it responds to each failure mode)
- Include sequence diagrams for critical paths
- Include data models / schemas

## INPUT / CONTEXT
APPROVED ARCHITECTURE (P4):
{{P4_ARTIFACT}}

## OUTPUT FORMAT
### Component: [Name]
**Responsibility:** [one sentence]
**Interface:**
```
method(input) -> output
```
**State:**
```
[state diagram or data structure]
```
**Dependencies:**
- [Component X]: [why needed]

**Error Scenarios:**
| Error | Response | Log / Metric |
|-------|----------|--------------|
| DB timeout | Retry 3x, then circuit break | metric: db_timeout |

### Sequence Diagram (Critical Path)
```
A -> B: message
B -> C: query
C --> B: result
B --> A: response
```

### Data Models
```json
{
  "User": {
    "id": "uuid",
    "email": "string"
  }
}
```
```

### P5 — Reviewers (Security / Scalability / Integration)

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 5: Component Design Review
**Mode:** Reviewer
**Objective:** Validate component specifications
**Prior Approved Artifacts:** P1-P5 Draft
**Output Artifact:** P5 Component Review

## YOUR ROLE
ROLE: {{REVIEWER_ROLE}} (Security / Scalability / Integration)
INSTRUCTIONS:
- {{SECURITY}}: Check for injection points, auth bypasses, insecure defaults, data leaks
- {{SCALABILITY}}: Check for resource exhaustion, blocking operations, cache invalidation
- {{INTEGRATION}}: Check API contract consistency, migration paths, third-party failure handling
- Use BLOCK for issues that would break the design if implemented.

## INPUT / CONTEXT
COMPONENT SPECIFICATIONS (P5):
{{P5_DRAFT}}

## OUTPUT FORMAT
### BLOCK
- [Critical issue]

### CONCERN
- [Risk with mitigation]

### QUESTIONS
- [Clarification needed]

### CONSENT STATUS
```

---

## Phase 6: Error Handling & Edge Cases (Author)

### P6 — Design Author

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 6: Error Handling & Edge Cases
**Mode:** Author
**Objective:** Design failure modes, recovery, and observability
**Prior Approved Artifacts:** P1-P5
**Output Artifact:** P6 Error Handling Strategy

## YOUR ROLE
ROLE: Design Author
INSTRUCTIONS:
- For EVERY component, build a failure modes matrix
- Define retry strategies (exponential backoff, circuit breaker, dead letter)
- Define observability: what metrics, logs, traces, alerts
- Define recovery procedures: how to get back to normal from each failure state
- Cross-reference P2 edge cases — are they all handled?

## INPUT / CONTEXT
COMPONENTS (P5):
{{P5_ARTIFACT}}

EDGE CASES (P2):
{{P2_EDGE_CASES}}

## OUTPUT FORMAT
### Failure Modes Matrix
| Component | Failure | Impact | Detection | Response | Recovery |
|-----------|---------|--------|-----------|----------|----------|
| ApiGateway | Timeout | User 504 | Latency metric | Retry 3x | Alert on retry exhaustion |

### Retry / Circuit Breaker Strategy
| Component | Strategy | Parameters |
|-----------|----------|------------|
| DB Client | Exponential backoff | base=100ms, max=5s, 3 retries |

### Observability Plan
- Metrics: [what to count]
- Logs: [what to log, at what level]
- Traces: [distributed trace points]
- Alerts: [SLO thresholds]

### Recovery Procedures
- [Step-by-step for each major failure class]

### Unhandled Gaps
- [Edge cases or failures not yet covered]
```

### P6 — Reviewers (Security / QA Lead)

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 6: Error Handling Review
**Mode:** Reviewer
**Objective:** Validate error handling coverage
**Prior Approved Artifacts:** P1-P6 Draft
**Output Artifact:** P6 Error Handling Review

## YOUR ROLE
ROLE: {{REVIEWER_ROLE}} (Security Engineer / QA Lead)
INSTRUCTIONS:
- {{SECURITY}}: Check for missing auth failures, unauthorized access handling, audit logging
- {{QA}}: Check that every critical path has an error test case, verify observability enables debugging
- Ensure no critical edge case from P2 is unhandled
- Use BLOCK if any critical path has undefined failure behavior.

## INPUT / CONTEXT
ERROR HANDLING DRAFT (P6):
{{P6_DRAFT}}

EDGE CASES (P2):
{{P2_EDGE_CASES}}

## OUTPUT FORMAT
### BLOCK
- [Critical uncovered path]

### CONCERN
- [Risk with mitigation]

### QUESTIONS
- [Clarification needed]

### CONSENT STATUS
```

---

## Phase 7: Testing & Validation Strategy (Author)

### P7 — QA Lead (Author)

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 7: Testing & Validation Strategy
**Mode:** Author
**Objective:** Design the complete test and validation approach
**Prior Approved Artifacts:** P1-P6
**Output Artifact:** P7 Testing Strategy

## YOUR ROLE
ROLE: QA/Testing Lead
INSTRUCTIONS:
- Design the test pyramid: unit / integration / contract / e2e / performance / chaos
- For each component, identify what test layer validates it
- Define test data strategy (fixtures, factories, seeded data)
- Define CI/CD validation gates (what must pass before merge/deploy)
- Cross-reference: every critical path and NFR must have a test

## INPUT / CONTEXT
COMPONENTS (P5):
{{P5_ARTIFACT}}

ERROR HANDLING (P6):
{{P6_ARTIFACT}}

REQUIREMENTS (P2):
{{P2_REQUIREMENTS}}

## OUTPUT FORMAT
### Test Pyramid
| Layer | Scope | Tools | Coverage Target |
|-------|-------|-------|-----------------|
| Unit | Component internals | pytest | 80% |
| Integration | Component interactions | testcontainers | Critical paths |
| Contract | API schemas | pact | All public APIs |
| E2E | User flows | playwright | Core journeys |
| Performance | Load, stress | k6 | NFR targets |
| Chaos | Failure injection | chaos monkey | Redundancy paths |

### Per-Component Test Plan
| Component | Unit | Integration | E2E | Notes |
|-----------|------|-------------|-----|-------|
| AuthService | ✅ | ✅ | Via login flow | Mock DB |

### CI/CD Gates
| Gate | Checks |
|------|--------|
| PR | Unit + lint + typecheck |
| Merge | Integration + contract |
| Deploy | E2E + performance |

### Test Data Strategy
- [How fixtures are created, how data is isolated between tests]

### Validation Matrix
| Requirement | Test(s) | Status |
|-------------|---------|--------|
| R1: User login | auth/login.e2e.ts | Covered |

### Coverage Gaps
- [Requirements or paths without assigned tests]
```

### P7 — Reviewers (Design Author / Security)

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 7: Testing Strategy Review
**Mode:** Reviewer
**Objective:** Validate test coverage and feasibility
**Prior Approved Artifacts:** P1-P7 Draft
**Output Artifact:** P7 Testing Review

## YOUR ROLE
ROLE: {{REVIEWER_ROLE}} (Design Author / Security Engineer)
INSTRUCTIONS:
- {{DESIGN AUTHOR}}: Verify that tests can actually validate your design. Are interfaces testable?
- {{SECURITY}}: Check for security test cases (auth bypass, injection, privilege escalation)
- Ensure every Must-have requirement has a test
- Flag any test that would be flaky or impossible to automate

## INPUT / CONTEXT
TESTING STRATEGY (P7):
{{P7_DRAFT}}

## OUTPUT FORMAT
### BLOCK
- [Untestable design or missing critical test]

### CONCERN
- [Risk of flaky tests, slow CI]

### QUESTIONS
- [Clarification needed]

### CONSENT STATUS
```

---

## Phase 8: Consensus & Finalization (Roundtable)

### P8 — All Agents

```markdown
{{WORKSHOP_CHARTER}}
---
# PHASE 8: Consensus & Finalization
**Mode:** Roundtable
**Objective:** Review full design document, raise final objections, resolve or document them
**Prior Approved Artifacts:** P1-P7 (all approved)
**Output Artifact:** P8 Consensus Record + Final Design Document

## YOUR ROLE
ROLE: {{ASSIGNED_ROLE}}
INSTRUCTIONS:
- Review the COMPLETE design document (all sections below)
- Check for: inconsistencies, contradictions with earlier phases, missing sections
- Verify that YOUR area of expertise is adequately covered
- If you find a BLOCK-level issue, raise it now. After this phase, the design is locked.
- If you consent, say so explicitly.

## INPUT / CONTEXT
COMPLETE DESIGN DOCUMENT:
{{FULL_DESIGN_DOC}}

## OUTPUT FORMAT
### Section-by-Section Review
| Section | Status (CONSENT/CONCERN/BLOCK) | Notes |
|---------|-------------------------------|-------|
| P1 Problem | | |
| P2 Requirements | | |
| P3 Approach | | |
| P4 Architecture | | |
| P5 Components | | |
| P6 Error Handling | | |
| P7 Testing | | |

### BLOCK (if any)
- [Must fix before finalization]

### CONCERN (if any)
- [Acceptable risk, document it]

### FINAL CONSENT / DISSENT
- I CONSENT to this design as finalized
- OR: I DISSENT on [section] for [reason]. I accept the facilitator's decision to proceed with documented dissent.

---

### OPTIONAL: Phase 8b — Implementation Handoff

After consensus is reached and the design is locked, if the user requests, generate an implementation task list:

```markdown
## 9. Implementation Task List (Optional)

Convert the design into a series of prompts for a code-generation agent.
Prioritize best practices, incremental progress, and early testing.
Each task builds on previous tasks. No hanging/orphaned code.

### Tasks
1. [ ] [Concrete coding task — e.g., "Implement User model with validation"]
   - References: R1, R2 (requirements)
   - Files: src/models/user.ts, src/models/user.test.ts
   - Acceptance: tests pass, typecheck passes

2. [ ] [Next task that depends on previous]
   ...
```

Task rules:
- Each task is a concrete coding action (write, modify, or test code)
- Specify files/components to create or modify
- Reference specific requirements from P2
- Avoid non-coding tasks: UAT, deployment, performance analysis, user training
- Prioritize test-driven development where appropriate
- Sequence to validate core functionality early
```

---

## Facilitator Utilities

### Phase Transition Prompt

```markdown
PHASE {{N}} COMPLETE.

Synthesized Artifact:
{{SYNTHESIZED_PHASE_OUTPUT}}

BLOCK Check: Does any agent BLOCK this artifact?
If no BLOCKs within [timeout], facilitator advances to Phase {{N+1}}.

FACILITATOR APPROVAL: "APPROVED, proceed to Phase {{N+1}}."
```

### Backtrack Announcement

```markdown
BLOCK VALIDATED: {{BLOCK_DESCRIPTION}}

We are BACKTRACKING from Phase {{CURRENT}} to Phase {{TARGET}}.
Reason: {{RATIONALE}}

New directive for Phase {{TARGET}}:
{{REWORK_INSTRUCTIONS}}
```

### Facilitator Override

```markdown
BLOCK RECEIVED: {{BLOCK_DESCRIPTION}}

FACILITATOR DECISION: OVERRIDE
Rationale: {{WHY_BLOCK_IS_INVALID_OR_ACCEPTABLE}}

We proceed to Phase {{N+1}} with this documented dissent:
{{DISSENT_NOTE}}
```
