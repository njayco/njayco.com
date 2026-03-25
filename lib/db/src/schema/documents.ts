import { pgTable, serial, text, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const docCategoryEnum = pgEnum("doc_category", ["corporate", "investor", "press", "legal", "division", "services"]);
export const fileTypeEnum = pgEnum("file_type", ["txt", "doc", "pdf", "ppt"]);

export const documentsTable = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  filename: text("filename").notNull(),
  category: docCategoryEnum("category").notNull().default("corporate"),
  content: text("content").notNull(),
  fileType: fileTypeEnum("file_type").notNull().default("txt"),
  divisionId: integer("division_id"),
  public: boolean("public").notNull().default(true),
});

export const insertDocumentSchema = createInsertSchema(documentsTable).omit({ id: true });
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documentsTable.$inferSelect;
