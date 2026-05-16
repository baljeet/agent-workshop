import type { AnalyzeRequest, RequirementInput, RequirementRecord, SolutionPlan, SourceDocument } from "@app/shared";
import { PlanningEngine } from "../services/planningEngine.js";
import { RepoIndexer } from "../services/repoIndexer.js";
import { RequirementRepository } from "../services/requirementRepository.js";

export interface ToolResult<T> {
  success: boolean;
  shouldContinue: boolean;
  output?: T;
  error?: string;
}

export class AgentTools {
  constructor(
    private readonly repository: RequirementRepository,
    private readonly indexer: RepoIndexer,
    private readonly planner: PlanningEngine
  ) {}

  async createRequirement(input: RequirementInput): Promise<ToolResult<RequirementRecord>> {
    const requirement = await this.repository.createRequirement(input);
    return success(requirement);
  }

  async readRequirement(requirementId: string): Promise<ToolResult<RequirementRecord>> {
    const requirement = await this.repository.getRequirement(requirementId);
    if (!requirement) {
      return error(`Requirement '${requirementId}' not found.`);
    }
    return success(requirement);
  }

  async listRequirements(): Promise<ToolResult<RequirementRecord[]>> {
    const items = await this.repository.listRequirements();
    return success(items);
  }

  async updateRequirementDocument(
    requirementId: string,
    document: Omit<SourceDocument, "id" | "createdAt">
  ): Promise<ToolResult<RequirementRecord>> {
    const requirement = await this.repository.addDocument(requirementId, document);
    if (!requirement) {
      return error(`Requirement '${requirementId}' not found.`);
    }
    return success(requirement);
  }

  async listAvailableTypes(): Promise<ToolResult<string[]>> {
    return success(["frontend", "backend", "api"]);
  }

  async analyzeRequirement(requirementId: string, request: AnalyzeRequest = {}): Promise<ToolResult<SolutionPlan>> {
    const requirement = await this.repository.getRequirement(requirementId);
    if (!requirement) {
      return error(`Requirement '${requirementId}' not found.`);
    }

    const blocks = await this.indexer.indexRepo(requirement.input.targetRepoPath, {
      includePaths: request.includePaths,
      excludePaths: request.excludePaths
    });
    const plan = this.planner.generatePlan(requirement, blocks);
    await this.repository.savePlan(plan);

    return complete(plan);
  }

  async readPlan(requirementId: string): Promise<ToolResult<SolutionPlan>> {
    const plan = await this.repository.getPlan(requirementId);
    if (!plan) {
      return error(`No plan found for requirement '${requirementId}'.`);
    }
    return success(plan);
  }
}

const success = <T>(output: T): ToolResult<T> => ({
  success: true,
  shouldContinue: true,
  output
});

const error = <T>(message: string): ToolResult<T> => ({
  success: false,
  shouldContinue: true,
  error: message
});

const complete = <T>(output: T): ToolResult<T> => ({
  success: true,
  shouldContinue: false,
  output
});
