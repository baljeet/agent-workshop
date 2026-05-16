import type { RequirementRecord, SolutionPlan } from "@app/shared";

export interface RequirementDatabase {
  requirements: RequirementRecord[];
  plans: SolutionPlan[];
}

export const defaultRequirementDatabase = (): RequirementDatabase => ({
  requirements: [],
  plans: []
});
