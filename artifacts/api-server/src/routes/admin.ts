import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, divisionsTable, artistsTable, tracksTable, documentsTable, adminSettingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-admin-token"] as string | undefined;
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || token !== adminToken) {
    res.status(403).json({ error: "Forbidden: admin access required" });
    return;
  }
  next();
}

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  try {
    const [divCountResult] = await db.select({ count: sql<number>`count(*)` }).from(divisionsTable);
    const [activeDivResult] = await db.select({ count: sql<number>`count(*)` }).from(divisionsTable).where(eq(divisionsTable.status, "live"));
    const [trackCountResult] = await db.select({ count: sql<number>`count(*)` }).from(tracksTable);
    const [artistCountResult] = await db.select({ count: sql<number>`count(*)` }).from(artistsTable);
    const [docCountResult] = await db.select({ count: sql<number>`count(*)` }).from(documentsTable);

    res.json({
      totalDivisions: Number(divCountResult.count),
      activeDivisions: Number(activeDivResult.count),
      totalTracks: Number(trackCountResult.count),
      totalArtists: Number(artistCountResult.count),
      totalDocuments: Number(docCountResult.count),
    });
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

const divisionUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(200).optional(),
  status: z.enum(["live", "development", "concept"]).optional(),
  sortOrder: z.number().int().optional(),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().optional(),
  websiteUrl: z.string().max(500).nullable().optional(),
  notepadContent: z.string().optional(),
  iconType: z.string().max(100).optional(),
  windowType: z.enum(["browser", "notepad", "music", "explorer", "admin", "custom"]).optional(),
});

router.put("/admin/divisions", requireAdmin, async (req, res) => {
  const parsed = divisionUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", issues: parsed.error.issues });
    return;
  }
  const { id, ...updates } = parsed.data;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No valid update fields provided" });
    return;
  }
  try {
    const [updated] = await db.update(divisionsTable)
      .set(updates)
      .where(eq(divisionsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Division not found" });
      return;
    }
    res.json(updated);
  } catch (_err) {
    res.status(500).json({ error: "Failed to update division" });
  }
});

router.get("/admin/settings", async (_req, res) => {
  try {
    const settings = await db.select().from(adminSettingsTable);
    res.json(settings);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

const settingUpdateSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
});

router.put("/admin/settings", requireAdmin, async (req, res) => {
  const parsed = settingUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", issues: parsed.error.issues });
    return;
  }
  try {
    const [updated] = await db.update(adminSettingsTable)
      .set({ value: parsed.data.value })
      .where(eq(adminSettingsTable.key, parsed.data.key))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Setting not found" });
      return;
    }
    res.json(updated);
  } catch (_err) {
    res.status(500).json({ error: "Failed to update setting" });
  }
});

export default router;
