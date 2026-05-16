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
