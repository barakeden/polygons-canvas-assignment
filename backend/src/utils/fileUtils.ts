import fs from "fs/promises";

export function delay(ms = 5000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function readJSON<T>(file: string): Promise<T> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T;
  } catch {
    return [] as unknown as T;
  }
}

export async function writeJSON(file: string, data: any): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}
