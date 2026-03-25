import { Router, type IRouter } from "express";
import { db, divisionsTable, artistsTable, tracksTable, documentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/admin/stats", async (_req, res) => {
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
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

router.put("/admin/divisions", async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID required" });
      return;
    }
    const [updated] = await db.update(divisionsTable)
      .set(updates)
      .where(eq(divisionsTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update division" });
  }
});

export default router;
