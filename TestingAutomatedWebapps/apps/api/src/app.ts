import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PlanningEngine } from "./services/planningEngine.js";
import { RepoIndexer } from "./services/repoIndexer.js";
import { RequirementRepository } from "./services/requirementRepository.js";
import { registerRequirementRoutes } from "./routes/requirementRoutes.js";
import { AgentTools } from "./tools/agentTools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppOptions {
  dataDir?: string;
}

export const createApp = async (options: AppOptions = {}): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  });

  const dataDir = options.dataDir ?? path.resolve(__dirname, "../../.data");
  const repository = new RequirementRepository(dataDir);
  const indexer = new RepoIndexer();
  const planner = new PlanningEngine();
  const tools = new AgentTools(repository, indexer, planner);

  await registerRequirementRoutes(app, tools);

  return app;
};
