import { readdir, readFile } from "node:fs/promises";
import type { Dirent } from "node:fs";
import path from "node:path";
import type { BuildingBlock, ComponentKind } from "@app/shared";
import { createId } from "../utils/id.js";

interface IndexerOptions {
  includePaths?: string[];
  excludePaths?: string[];
}

const DEFAULT_EXCLUDED_SEGMENTS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage"
];

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);

const STOP_WORDS = new Set([
  "const",
  "function",
  "return",
  "import",
  "from",
  "type",
  "interface",
  "props",
  "class",
  "export",
  "async",
  "await",
  "default"
]);

export class RepoIndexer {
  async indexRepo(repoPath: string, options: IndexerOptions = {}): Promise<BuildingBlock[]> {
    const includePaths = options.includePaths?.length
      ? options.includePaths.map((segment) => path.resolve(repoPath, segment))
      : [repoPath];
    const excludeSet = new Set(
      (options.excludePaths ?? []).map((segment) => path.resolve(repoPath, segment))
    );

    const files: string[] = [];
    for (const includePath of includePaths) {
      const discovered = await this.walk(includePath, excludeSet);
      files.push(...discovered);
    }

    const uniqueFiles = [...new Set(files)];
    const sourceFiles = uniqueFiles.filter((filePath) => SOURCE_EXTENSIONS.has(path.extname(filePath)));

    const blocks = await Promise.all(sourceFiles.map((filePath) => this.fileToBlock(repoPath, filePath)));
    return blocks.filter((entry): entry is BuildingBlock => entry !== null);
  }

  private async walk(currentPath: string, excludeSet: Set<string>): Promise<string[]> {
    if (excludeSet.has(currentPath)) {
      return [];
    }

    let dirents: Dirent[];
    try {
      dirents = await readdir(currentPath, { withFileTypes: true });
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        return [];
      }
      throw error;
    }
    const files: string[] = [];

    for (const dirent of dirents) {
      const fullPath = path.join(currentPath, dirent.name);
      if (excludeSet.has(fullPath)) {
        continue;
      }

      if (DEFAULT_EXCLUDED_SEGMENTS.includes(dirent.name)) {
        continue;
      }

      if (dirent.isDirectory()) {
        files.push(...(await this.walk(fullPath, excludeSet)));
      } else if (dirent.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private async fileToBlock(repoPath: string, absoluteFilePath: string): Promise<BuildingBlock | null> {
    const relativePath = path.relative(repoPath, absoluteFilePath);
    const lowerPath = relativePath.toLowerCase();
    if (
      lowerPath.includes(".test.") ||
      lowerPath.includes(".spec.") ||
      lowerPath.includes("/.data/") ||
      lowerPath.includes("/dist/") ||
      lowerPath.includes("/coverage/")
    ) {
      return null;
    }

    const kind = inferKind(relativePath);

    if (!kind) {
      return null;
    }

    const source = await readFile(absoluteFilePath, "utf8");
    const exports = extractExports(source);
    const dependencies = extractImports(source);
    const keywords = extractKeywords(relativePath, source);
    const confidence = scoreConfidence(kind, relativePath, source);

    return {
      id: createId(),
      name: deriveName(relativePath),
      kind,
      path: relativePath,
      description: describe(kind, relativePath, exports),
      exports,
      dependencies,
      keywords,
      confidence
    };
  }
}

const inferKind = (relativePath: string): ComponentKind | null => {
  const lower = relativePath.toLowerCase();

  if (/(route|controller|handler|endpoint|openapi|swagger|api)/.test(lower)) {
    return "api";
  }

  if (/(component|page|screen|ui|widget|tsx|jsx)/.test(lower)) {
    return "frontend";
  }

  if (/(service|repository|model|domain|worker|job|backend|server)/.test(lower)) {
    return "backend";
  }

  return null;
};

const deriveName = (relativePath: string): string => {
  const filename = path.basename(relativePath, path.extname(relativePath));
  return filename
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const extractExports = (source: string): string[] => {
  const matches = source.matchAll(/export\s+(?:const|function|class|type|interface)\s+([A-Za-z0-9_]+)/g);
  return [...new Set(Array.from(matches, (match) => match[1]))].slice(0, 12);
};

const extractImports = (source: string): string[] => {
  const matches = source.matchAll(/from\s+["']([^"']+)["']/g);
  return [...new Set(Array.from(matches, (match) => match[1]))].slice(0, 20);
};

const extractKeywords = (relativePath: string, source: string): string[] => {
  const pathTokens = relativePath
    .split(/[\/.\-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  const sourceTokens = (source.match(/[A-Za-z][A-Za-z0-9_]{2,}/g) ?? [])
    .map((token) => token.toLowerCase())
    .filter((token) => !STOP_WORDS.has(token))
    .slice(0, 1200);

  const frequency = new Map<string, number>();
  for (const token of [...pathTokens, ...sourceTokens]) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([token]) => token);
};

const scoreConfidence = (kind: ComponentKind, relativePath: string, source: string): number => {
  let score = 0.45;
  const lower = relativePath.toLowerCase();

  if (kind === "frontend" && /tsx|jsx|component|page|screen|ui/.test(lower)) {
    score += 0.3;
  }

  if (kind === "backend" && /service|repository|worker|model|server/.test(lower)) {
    score += 0.3;
  }

  if (kind === "api" && /route|controller|handler|endpoint|openapi|api/.test(lower)) {
    score += 0.3;
  }

  if (source.includes("export")) {
    score += 0.1;
  }

  return Math.min(1, Number(score.toFixed(2)));
};

const describe = (kind: ComponentKind, relativePath: string, exports: string[]): string => {
  const primary = exports[0] ? `Primary export: ${exports[0]}.` : "No explicit export matched.";
  return `${kind.toUpperCase()} building block from ${relativePath}. ${primary}`;
};
