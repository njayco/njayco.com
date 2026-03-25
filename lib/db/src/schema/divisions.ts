import { pgTable, serial, text, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const windowTypeEnum = pgEnum("window_type", ["browser", "notepad", "music", "explorer", "admin", "custom"]);
export const statusEnum = pgEnum("status", ["live", "development", "concept"]);
export const categoryEnum = pgEnum("category", ["music", "tech", "education", "logistics", "media", "corporate", "creative"]);

export const divisionsTable = pgTable("divisions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  websiteUrl: text("website_url"),
  iconType: text("icon_type").notNull().default("folder"),
  iconColor: text("icon_color").notNull().default("#3B82F6"),
  windowType: windowTypeEnum("window_type").notNull().default("browser"),
  notepadContent: text("notepad_content"),
  status: statusEnum("status").notNull().default("concept"),
  category: categoryEnum("category").notNull().default("corporate"),
  sortOrder: integer("sort_order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
});

export const insertDivisionSchema = createInsertSchema(divisionsTable).omit({ id: true });
export type InsertDivision = z.infer<typeof insertDivisionSchema>;
export type Division = typeof divisionsTable.$inferSelect;
