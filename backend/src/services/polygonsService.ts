import path from "path";
import { Polygon } from "../types/polygon";
import { delay, readJSON, writeJSON } from "../utils/fileUtils";

const POLYGONS_FILE = path.join(__dirname, "../data/polygons.json");

export async function getAll(): Promise<Polygon[]> {
  await delay(5000);
  return await readJSON<Polygon[]>(POLYGONS_FILE);
}

export async function create(body: any): Promise<Polygon> {
  const { name, points } = body;

  await delay(5000);

  if (!name || !Array.isArray(points)) {
    throw new Error("Invalid input");
  }

  const polygons = await readJSON<Polygon[]>(POLYGONS_FILE);
  const newId = polygons.length ? Math.max(...polygons.map(p => p.id)) + 1 : 1;

  const newPolygon: Polygon = { id: newId, name, points };
  polygons.push(newPolygon);

  await writeJSON(POLYGONS_FILE, polygons);
  return newPolygon;
}

export async function remove(id: number): Promise<{ id: number }> {
  await delay(5000);

  const polygons = await readJSON<Polygon[]>(POLYGONS_FILE);
  const filtered = polygons.filter(p => p.id !== id);

  if (filtered.length === polygons.length) {
    throw new Error("Polygon not found");
  }

  await writeJSON(POLYGONS_FILE, filtered);
  return { id };
}
