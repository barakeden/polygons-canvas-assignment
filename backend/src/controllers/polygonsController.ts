import { Request, Response } from "express";
import * as polygonsService from "../services/polygonsService";
import { log } from "console";

export async function getPolygons(req: Request, res: Response) {
  try {
    const data = await polygonsService.getAll();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export async function createPolygon(req: Request, res: Response) {
  try {
    const polygon = await polygonsService.create(req.body);
    res.status(201).json(polygon);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
}

export async function deletePolygon(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await polygonsService.remove(id);
    res.json(result);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
}
