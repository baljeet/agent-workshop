export type ComponentKind = "frontend" | "backend" | "api";

export interface SourceDocument {
  id: string;
  type: "figma" | "solution_doc" | "notes";
  name: string;
  url?: string;
  content: string;
  createdAt: string;
}

export interface RequirementInput {
  title: string;
  summary: string;
  goals: string[];
  constraints: string[];
  targetRepoPath: string;
}

export interface RequirementRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  input: RequirementInput;
  documents: SourceDocument[];
}

export interface BuildingBlock {
  id: string;
  name: string;
  kind: ComponentKind;
  path: string;
  description: string;
  exports: string[];
  dependencies: string[];
  keywords: string[];
  confidence: number;
}

export interface ProposedComponent {
  id: string;
  name: string;
  kind: ComponentKind;
  reason: string;
  suggestedLocation: string;
  contracts: string[];
  acceptanceCriteria: string[];
}

export interface IntegrationStep {
  id: string;
  title: string;
  details: string;
  relatedComponents: string[];
}

export interface SolutionPlan {
  requirementId: string;
  generatedAt: string;
  existingBlocks: BuildingBlock[];
  newBlocks: ProposedComponent[];
  integrationSteps: IntegrationStep[];
  uncoveredRisks: string[];
}

export interface AnalyzeRequest {
  includePaths?: string[];
  excludePaths?: string[];
}
