import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { AgentTools } from "../tools/agentTools.js";

const requirementInputSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  goals: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  targetRepoPath: z.string().min(1)
});

const documentSchema = z.object({
  type: z.enum(["figma", "solution_doc", "notes"]),
  name: z.string().min(1),
  url: z.string().url().optional(),
  content: z.string().min(1)
});

const analyzeSchema = z.object({
  includePaths: z.array(z.string()).optional(),
  excludePaths: z.array(z.string()).optional()
});

export const registerRequirementRoutes = async (
  app: FastifyInstance,
  tools: AgentTools
): Promise<void> => {
  app.get("/health", async () => ({ ok: true, timestamp: new Date().toISOString() }));

  app.post("/requirements", async (request, reply) => {
    const parsed = requirementInputSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: "Invalid requirement payload",
        issues: parsed.error.issues
      });
    }

    const result = await tools.createRequirement(parsed.data);
    if (!result.success) {
      return reply.code(400).send({ error: result.error });
    }

    return reply.code(201).send(result.output);
  });

  app.get("/requirements", async () => {
    const result = await tools.listRequirements();
    return result.output;
  });

  app.get("/requirements/:id", async (request, reply) => {
    const params = z.object({ id: z.string() }).safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ error: "Invalid id" });
    }

    const [requirementResult, planResult] = await Promise.all([
      tools.readRequirement(params.data.id),
      tools.readPlan(params.data.id)
    ]);

    if (!requirementResult.success) {
      return reply.code(404).send({ error: requirementResult.error });
    }

    return {
      requirement: requirementResult.output,
      plan: planResult.success ? planResult.output : null
    };
  });

  app.post("/requirements/:id/documents", async (request, reply) => {
    const params = z.object({ id: z.string() }).safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ error: "Invalid id" });
    }

    const parsed = documentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid document payload", issues: parsed.error.issues });
    }

    const result = await tools.updateRequirementDocument(params.data.id, parsed.data);
    if (!result.success) {
      return reply.code(404).send({ error: result.error });
    }

    return result.output;
  });

  app.post("/requirements/:id/analyze", async (request, reply) => {
    const params = z.object({ id: z.string() }).safeParse(request.params);
    if (!params.success) {
      return reply.code(400).send({ error: "Invalid id" });
    }

    const parsed = analyzeSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid analyze payload", issues: parsed.error.issues });
    }

    const result = await tools.analyzeRequirement(params.data.id, parsed.data);
    if (!result.success) {
      return reply.code(404).send({ error: result.error, shouldContinue: result.shouldContinue });
    }

    return {
      shouldContinue: result.shouldContinue,
      plan: result.output
    };
  });

  app.get("/capabilities/types", async () => {
    const result = await tools.listAvailableTypes();
    return result.output;
  });
};
