import type {
  BuildingBlock,
  ProposedComponent,
  RequirementRecord,
  SolutionPlan,
  ComponentKind,
  IntegrationStep
} from "@app/shared";
import { createId } from "../utils/id.js";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "from",
  "this",
  "will",
  "have",
  "into",
  "should",
  "needs",
  "need",
  "using",
  "user",
  "users"
]);

const KIND_HINTS: Record<ComponentKind, string[]> = {
  frontend: ["ui", "screen", "page", "component", "form", "dashboard", "figma", "workflow"],
  backend: ["service", "domain", "job", "worker", "business", "logic", "database", "model"],
  api: ["api", "endpoint", "route", "contract", "integration", "request", "response"]
};

export class PlanningEngine {
  generatePlan(requirement: RequirementRecord, buildingBlocks: BuildingBlock[]): SolutionPlan {
    const intentKeywords = this.extractIntentKeywords(requirement);
    const matchedExisting = this.matchExistingBlocks(intentKeywords, buildingBlocks);
    const newBlocks = this.identifyGaps(intentKeywords, matchedExisting, requirement);
    const integrationSteps = this.createIntegrationSteps(matchedExisting, newBlocks);

    return {
      requirementId: requirement.id,
      generatedAt: new Date().toISOString(),
      existingBlocks: matchedExisting,
      newBlocks,
      integrationSteps,
      uncoveredRisks: this.deriveRisks(requirement, matchedExisting, newBlocks)
    };
  }

  private extractIntentKeywords(requirement: RequirementRecord): string[] {
    const rawText = [
      requirement.input.title,
      requirement.input.summary,
      requirement.input.goals.join(" "),
      requirement.input.constraints.join(" "),
      requirement.documents.map((doc) => `${doc.name} ${doc.content}`).join(" ")
    ].join(" ");

    const tokens = rawText
      .toLowerCase()
      .match(/[a-z][a-z0-9_]{2,}/g)
      ?.filter((token) => !STOP_WORDS.has(token)) ?? [];

    const frequency = new Map<string, number>();
    for (const token of tokens) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }

    return [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([token]) => token);
  }

  private matchExistingBlocks(keywords: string[], blocks: BuildingBlock[]): BuildingBlock[] {
    const scored = blocks
      .map((block) => ({
        block,
        score: overlapScore(keywords, block.keywords) + block.confidence * 0.4
      }))
      .filter((entry) => entry.score > 0.25)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((entry) => entry.block);

    const byKind: Record<ComponentKind, BuildingBlock[]> = {
      frontend: [],
      backend: [],
      api: []
    };

    for (const block of scored) {
      byKind[block.kind].push(block);
    }

    return [
      ...byKind.frontend.slice(0, 8),
      ...byKind.backend.slice(0, 8),
      ...byKind.api.slice(0, 8)
    ];
  }

  private identifyGaps(
    keywords: string[],
    existing: BuildingBlock[],
    requirement: RequirementRecord
  ): ProposedComponent[] {
    const existingTokens = new Set(existing.flatMap((entry) => entry.keywords));
    const missing = keywords.filter((token) => !existingTokens.has(token));

    const proposals: ProposedComponent[] = [];

    for (const kind of ["frontend", "backend", "api"] as const) {
      const seed = this.pickKeywordForKind(missing, kind) ?? this.pickKeywordForKind(keywords, kind) ?? "core";
      const canonicalName = `${toPascal(seed)}${kind === "api" ? "Endpoint" : kind === "backend" ? "Service" : "Module"}`;
      proposals.push({
        id: createId(),
        name: canonicalName,
        kind,
        reason: `No strong ${kind} match found for requirement intent around '${seed}'.`,
        suggestedLocation: suggestLocation(kind, canonicalName),
        contracts: suggestContracts(kind, canonicalName, requirement),
        acceptanceCriteria: acceptanceCriteria(kind, canonicalName)
      });
    }

    return dedupeProposals(proposals);
  }

  private pickKeywordForKind(keywords: string[], kind: ComponentKind): string | undefined {
    const hints = KIND_HINTS[kind];

    const strongMatch = keywords.find((keyword) => hints.some((hint) => keyword.includes(hint)));
    if (strongMatch) {
      return strongMatch;
    }

    return keywords.find((keyword) => keyword.length > 3);
  }

  private createIntegrationSteps(existing: BuildingBlock[], newBlocks: ProposedComponent[]): IntegrationStep[] {
    const existingIds = existing.map((entry) => entry.id);
    const newIds = newBlocks.map((entry) => entry.id);

    return [
      {
        id: createId(),
        title: "Map Reuse Candidates",
        details:
          "Confirm each selected existing building block against requirement goals and reject false positives before implementation.",
        relatedComponents: existingIds
      },
      {
        id: createId(),
        title: "Implement Net-New Blocks",
        details: "Implement proposed frontend, backend, and API components with contracts and acceptance criteria.",
        relatedComponents: newIds
      },
      {
        id: createId(),
        title: "Compose End-to-End Flow",
        details: "Wire UI modules to API endpoints and backend services, then validate happy path and error handling.",
        relatedComponents: [...existingIds.slice(0, 3), ...newIds]
      }
    ];
  }

  private deriveRisks(
    requirement: RequirementRecord,
    existingBlocks: BuildingBlock[],
    newBlocks: ProposedComponent[]
  ): string[] {
    const risks: string[] = [];

    if (requirement.documents.length === 0) {
      risks.push("No Figma or solution document was provided; component mapping confidence is reduced.");
    }

    if (existingBlocks.length < 3) {
      risks.push("Low reusable coverage detected; indexing rules may miss components in this codebase.");
    }

    if (newBlocks.some((entry) => entry.kind === "api") && existingBlocks.every((entry) => entry.kind !== "api")) {
      risks.push("No existing API blocks matched while new API work is required; validate service boundaries.");
    }

    if (requirement.input.constraints.length === 0) {
      risks.push("No constraints were provided; non-functional requirements may be missing.");
    }

    return risks;
  }
}

const overlapScore = (left: string[], right: string[]): number => {
  if (left.length === 0 || right.length === 0) {
    return 0;
  }

  const rightSet = new Set(right);
  const overlap = left.filter((token) => rightSet.has(token)).length;
  return overlap / Math.min(left.length, 20);
};

const toPascal = (value: string): string =>
  value
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

const suggestLocation = (kind: ComponentKind, name: string): string => {
  if (kind === "frontend") {
    return `src/components/${name}.tsx`;
  }

  if (kind === "backend") {
    return `src/services/${name}.ts`;
  }

  return `src/routes/${name}.ts`;
};

const suggestContracts = (
  kind: ComponentKind,
  name: string,
  requirement: RequirementRecord
): string[] => {
  if (kind === "api") {
    return [`POST /api/${slug(name)}`, `GET /api/${slug(name)}/:id`];
  }

  if (kind === "backend") {
    return [`${name}.execute(input): Promise<Result>`, `${name}.validate(input): ValidationResult`];
  }

  return [
    `<${name} requirementId="${requirement.id}" />`,
    `${name}Props { onSubmit(): void; loading: boolean }`
  ];
};

const acceptanceCriteria = (kind: ComponentKind, name: string): string[] => {
  if (kind === "frontend") {
    return [
      `${name} renders required states (loading/error/success).`,
      `${name} integrates with generated API contract.`
    ];
  }

  if (kind === "backend") {
    return [
      `${name} applies domain validation rules from requirements.`,
      `${name} is covered by unit tests for happy and edge cases.`
    ];
  }

  return [
    `${name} endpoint validates input and returns typed output.`,
    `${name} endpoint handles failures with explicit error responses.`
  ];
};

const slug = (value: string): string => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const dedupeProposals = (items: ProposedComponent[]): ProposedComponent[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.kind}-${item.name.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};
