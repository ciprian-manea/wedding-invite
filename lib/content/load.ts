import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { contentSchema, type Content } from "./schema";

export async function loadContent(slug: string): Promise<Content> {
  "use cache";
  const filePath = path.join(process.cwd(), "content", `${slug}.json`);
  const raw = await readFile(filePath, "utf-8");
  const json = JSON.parse(raw);

  const result = contentSchema.safeParse(json);
  if (!result.success) {
    const issues = z.prettifyError(result.error);
    throw new Error(`Invalid content in content/${slug}.json:\n${issues}`);
  }

  return result.data;
}
