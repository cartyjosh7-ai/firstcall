import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { EngineReport } from "./agents/types";

function dir() {
  return path.join(process.cwd(), "data", "reports");
}

export async function saveReport(report: EngineReport) {
  await mkdir(dir(), { recursive: true });
  await writeFile(path.join(dir(), `${report.id}.json`), JSON.stringify(report, null, 2), "utf8");
}

export async function loadReport(id: string): Promise<EngineReport | null> {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  try {
    const text = await readFile(path.join(dir(), `${id}.json`), "utf8");
    return JSON.parse(text) as EngineReport;
  } catch {
    return null;
  }
}
