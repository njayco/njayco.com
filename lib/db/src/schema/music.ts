import { pgTable, serial, text, integer, boolean, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const albumTypeEnum = pgEnum("album_type", ["album", "ep", "single"]);

export const artistsTable = pgTable("artists", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  genre: text("genre").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
});

export const albumsTable = pgTable("albums", {
  id: serial("id").primaryKey(),
  artistId: integer("artist_id").notNull().references(() => artistsTable.id),
  title: text("title").notNull(),
  coverUrl: text("cover_url"),
  releaseYear: integer("release_year").notNull(),
  genre: text("genre").notNull(),
  price: real("price").notNull().default(9.99),
  albumType: albumTypeEnum("album_type").notNull().default("album"),
  featured: boolean("featured").notNull().default(false),
});

export const tracksTable = pgTable("tracks", {
  id: serial("id").primaryKey(),
  albumId: integer("album_id").notNull().references(() => albumsTable.id),
  artistId: integer("artist_id").notNull().references(() => artistsTable.id),
  title: text("title").notNull(),
  trackNumber: integer("track_number").notNull().default(1),
  duration: integer("duration").notNull().default(210),
  audioUrl: text("audio_url"),
  previewUrl: text("preview_url"),
  price: real("price").notNull().default(0.99),
  isExplicit: boolean("is_explicit").notNull().default(false),
  streamable: boolean("streamable").notNull().default(true),
  downloadable: boolean("downloadable").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
});

export const insertArtistSchema = createInsertSchema(artistsTable).omit({ id: true });
export const insertAlbumSchema = createInsertSchema(albumsTable).omit({ id: true });
export const insertTrackSchema = createInsertSchema(tracksTable).omit({ id: true });

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Artist = typeof artistsTable.$inferSelect;
export type Album = typeof albumsTable.$inferSelect;
export type Track = typeof tracksTable.$inferSelect;
