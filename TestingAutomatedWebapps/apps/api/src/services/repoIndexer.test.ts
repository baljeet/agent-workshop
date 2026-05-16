import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RepoIndexer } from "./repoIndexer.js";

describe("RepoIndexer", () => {
  it("indexes frontend, backend, and api building blocks", async () => {
    const tmpRoot = await mkdtemp(path.join(os.tmpdir(), "repo-indexer-"));

    await mkdir(path.join(tmpRoot, "src/components"), { recursive: true });
    await mkdir(path.join(tmpRoot, "src/services"), { recursive: true });
    await mkdir(path.join(tmpRoot, "src/routes"), { recursive: true });

    await writeFile(
      path.join(tmpRoot, "src/components/CheckoutWidget.tsx"),
      'export function CheckoutWidget() { return <div />; }'
    );
    await writeFile(
      path.join(tmpRoot, "src/services/OrderService.ts"),
      'export class OrderService { execute() {} }'
    );
    await writeFile(
      path.join(tmpRoot, "src/routes/order.route.ts"),
      'export const orderRoute = { method: "POST" };'
    );

    const indexer = new RepoIndexer();
    const blocks = await indexer.indexRepo(tmpRoot);

    expect(blocks.some((block) => block.kind === "frontend")).toBe(true);
    expect(blocks.some((block) => block.kind === "backend")).toBe(true);
    expect(blocks.some((block) => block.kind === "api")).toBe(true);
  });
});
