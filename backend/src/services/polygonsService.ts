import path from "path";
import { v4 as uuidv4 } from "uuid";
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
  const newId = uuidv4();

  const newPolygon: Polygon = { id: newId, name, points };
  polygons.push(newPolygon);

  await writeJSON(POLYGONS_FILE, polygons);
  return newPolygon;
}

export async function remove(id: string): Promise<{ id: string }> {
  await delay(5000);

  const polygons = await readJSON<Polygon[]>(POLYGONS_FILE);
  const filtered = polygons.filter(p => p.id !== id);

  if (filtered.length === polygons.length) {
    throw new Error("Polygon not found");
  }

  await writeJSON(POLYGONS_FILE, filtered);
  return { id };
}
