import { Router, type IRouter } from "express";
import { db, documentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

type DocCategory = "corporate" | "investor" | "press" | "legal" | "division" | "services";
const VALID_CATEGORIES: ReadonlySet<DocCategory> = new Set([
  "corporate", "investor", "press", "legal", "division", "services"
]);

const router: IRouter = Router();

router.get("/documents", async (req, res) => {
  try {
    const rawCategory = req.query.category as string | undefined;
    const category = rawCategory && VALID_CATEGORIES.has(rawCategory as DocCategory)
      ? (rawCategory as DocCategory)
      : undefined;

    const docs = category
      ? await db.select().from(documentsTable).where(
          and(eq(documentsTable.public, true), eq(documentsTable.category, category))
        )
      : await db.select().from(documentsTable).where(eq(documentsTable.public, true));

    res.json(docs);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

router.get("/documents/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [doc] = await db.select().from(documentsTable)
      .where(and(eq(documentsTable.id, id), eq(documentsTable.public, true)));
    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    res.json(doc);
  } catch (_err) {
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

export default router;
