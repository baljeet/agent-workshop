import path from "node:path";
import type { RequirementInput, RequirementRecord, SolutionPlan, SourceDocument } from "@app/shared";
import { defaultRequirementDatabase, type RequirementDatabase } from "../domain/models.js";
import { FileStore } from "../storage/fileStore.js";
import { createId } from "../utils/id.js";

export class RequirementRepository {
  private readonly store: FileStore<RequirementDatabase>;

  constructor(baseDir: string) {
    this.store = new FileStore<RequirementDatabase>(path.join(baseDir, "requirements.json"));
  }

  private async readDb(): Promise<RequirementDatabase> {
    try {
      return await this.store.read();
    } catch {
      const initial = defaultRequirementDatabase();
      await this.store.write(initial);
      return initial;
    }
  }

  async createRequirement(input: RequirementInput): Promise<RequirementRecord> {
    const db = await this.readDb();
    const now = new Date().toISOString();
    const record: RequirementRecord = {
      id: createId(),
      createdAt: now,
      updatedAt: now,
      input,
      documents: []
    };
    db.requirements.push(record);
    await this.store.write(db);
    return record;
  }

  async listRequirements(): Promise<RequirementRecord[]> {
    const db = await this.readDb();
    return db.requirements;
  }

  async getRequirement(id: string): Promise<RequirementRecord | undefined> {
    const db = await this.readDb();
    return db.requirements.find((requirement) => requirement.id === id);
  }

  async addDocument(
    requirementId: string,
    documentInput: Omit<SourceDocument, "id" | "createdAt">
  ): Promise<RequirementRecord | undefined> {
    const db = await this.readDb();
    const requirement = db.requirements.find((entry) => entry.id === requirementId);
    if (!requirement) {
      return undefined;
    }

    const now = new Date().toISOString();
    requirement.documents.push({
      id: createId(),
      createdAt: now,
      ...documentInput
    });
    requirement.updatedAt = now;

    await this.store.write(db);
    return requirement;
  }

  async savePlan(plan: SolutionPlan): Promise<void> {
    const db = await this.readDb();
    db.plans = db.plans.filter((entry) => entry.requirementId !== plan.requirementId);
    db.plans.push(plan);
    await this.store.write(db);
  }

  async getPlan(requirementId: string): Promise<SolutionPlan | undefined> {
    const db = await this.readDb();
    return db.plans.find((entry) => entry.requirementId === requirementId);
  }
}
