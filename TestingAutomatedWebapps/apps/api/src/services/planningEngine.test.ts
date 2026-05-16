import { describe, expect, it } from "vitest";
import type { BuildingBlock, RequirementRecord } from "@app/shared";
import { PlanningEngine } from "./planningEngine.js";

const requirement: RequirementRecord = {
  id: "req-1",
  createdAt: new Date("2026-03-01T10:00:00Z").toISOString(),
  updatedAt: new Date("2026-03-01T10:00:00Z").toISOString(),
  input: {
    title: "Checkout upsell experience",
    summary: "Need dynamic recommendations in checkout and API for pricing.",
    goals: ["increase conversion", "surface relevant products"],
    constraints: ["no downtime"],
    targetRepoPath: "/tmp/repo"
  },
  documents: [
    {
      id: "doc-1",
      type: "figma",
      name: "Checkout Figma",
      content: "Checkout screen includes upsell card and CTA",
      createdAt: new Date("2026-03-01T10:00:00Z").toISOString()
    }
  ]
};

const blocks: BuildingBlock[] = [
  {
    id: "b1",
    name: "Checkout Widget",
    kind: "frontend",
    path: "src/components/CheckoutWidget.tsx",
    description: "checkout widget",
    exports: ["CheckoutWidget"],
    dependencies: [],
    keywords: ["checkout", "upsell", "screen", "component"],
    confidence: 0.9
  },
  {
    id: "b2",
    name: "Pricing Service",
    kind: "backend",
    path: "src/services/PricingService.ts",
    description: "pricing service",
    exports: ["PricingService"],
    dependencies: [],
    keywords: ["pricing", "recommendations", "business", "logic"],
    confidence: 0.92
  },
  {
    id: "b3",
    name: "Checkout Api",
    kind: "api",
    path: "src/routes/checkout.route.ts",
    description: "checkout api",
    exports: ["checkoutRoute"],
    dependencies: [],
    keywords: ["checkout", "api", "endpoint", "request"],
    confidence: 0.93
  }
];

describe("PlanningEngine", () => {
  it("creates a cross-layer solution plan", () => {
    const engine = new PlanningEngine();
    const plan = engine.generatePlan(requirement, blocks);

    expect(plan.requirementId).toBe(requirement.id);
    expect(plan.existingBlocks.length).toBeGreaterThan(0);
    expect(plan.newBlocks.length).toBeGreaterThan(0);
    expect(plan.integrationSteps.length).toBe(3);
    expect(plan.newBlocks.some((block) => block.kind === "frontend")).toBe(true);
    expect(plan.newBlocks.some((block) => block.kind === "backend")).toBe(true);
    expect(plan.newBlocks.some((block) => block.kind === "api")).toBe(true);
  });
});
