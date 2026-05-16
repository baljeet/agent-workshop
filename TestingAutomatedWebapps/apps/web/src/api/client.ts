import type { RequirementRecord, SolutionPlan, SourceDocument } from "@app/shared";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4200";

export interface RequirementPayload {
  title: string;
  summary: string;
  goals: string[];
  constraints: string[];
  targetRepoPath: string;
}

export const createRequirement = async (payload: RequirementPayload): Promise<RequirementRecord> => {
  const response = await fetch(`${API_BASE}/requirements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to create requirement: ${response.status}`);
  }

  return (await response.json()) as RequirementRecord;
};

export interface DocumentPayload {
  type: SourceDocument["type"];
  name: string;
  url?: string;
  content: string;
}

export const addDocument = async (
  requirementId: string,
  payload: DocumentPayload
): Promise<RequirementRecord> => {
  const response = await fetch(`${API_BASE}/requirements/${requirementId}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to add document: ${response.status}`);
  }

  return (await response.json()) as RequirementRecord;
};

export const analyzeRequirement = async (requirementId: string): Promise<SolutionPlan> => {
  const response = await fetch(`${API_BASE}/requirements/${requirementId}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    throw new Error(`Failed to analyze requirement: ${response.status}`);
  }

  const data = (await response.json()) as { plan: SolutionPlan; shouldContinue: boolean };
  return data.plan;
};
