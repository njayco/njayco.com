import { Router, type IRouter } from "express";
import { db, divisionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/divisions", async (_req, res) => {
  try {
    const divisions = await db.select().from(divisionsTable).orderBy(divisionsTable.sortOrder);
    res.json(divisions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch divisions" });
  }
});

router.get("/divisions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [division] = await db.select().from(divisionsTable).where(eq(divisionsTable.id, id));
    if (!division) {
      res.status(404).json({ error: "Division not found" });
      return;
    }
    res.json(division);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch division" });
  }
});

export default router;
