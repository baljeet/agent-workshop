import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export class FileStore<T> {
  constructor(private readonly filePath: string) {}

  async read(): Promise<T> {
    try {
      const contents = await readFile(this.filePath, "utf8");
      return JSON.parse(contents) as T;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === "ENOENT") {
        throw new Error(`Missing store file: ${this.filePath}`);
      }
      throw error;
    }
  }

  async write(value: T): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(value, null, 2), "utf8");
  }
}
