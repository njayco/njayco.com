import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, divisionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { insertDivisionSchema } from "@workspace/db/schema";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-admin-token"] as string | undefined;
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && token !== adminToken) {
    res.status(403).json({ error: "Forbidden: admin access required" });
    return;
  }
  next();
}

router.get("/divisions", async (_req, res) => {
  try {
    const divisions = await db.select().from(divisionsTable).orderBy(divisionsTable.sortOrder);
    res.json(divisions);
  } catch (_err) {
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
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch division" });
  }
});

router.post("/divisions", requireAdmin, async (req, res) => {
  try {
    const parsed = insertDivisionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }
    const [created] = await db.insert(divisionsTable).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (_err) {
    res.status(500).json({ error: "Failed to create division" });
  }
});

export default router;
