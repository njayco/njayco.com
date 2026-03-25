import { Router, type IRouter } from "express";
import { db, artistsTable, albumsTable, tracksTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/artists", async (_req, res) => {
  try {
    const artists = await db.select().from(artistsTable).orderBy(artistsTable.name);
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artists" });
  }
});

router.get("/artists/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.id, id));
    if (!artist) {
      res.status(404).json({ error: "Artist not found" });
      return;
    }
    const albums = await db.select().from(albumsTable).where(eq(albumsTable.artistId, id));
    const topTracks = await db.select().from(tracksTable)
      .where(eq(tracksTable.artistId, id))
      .limit(10);

    const albumsWithMeta = albums.map(a => ({
      ...a,
      artistName: artist.name,
      trackCount: 0,
    }));

    const tracksWithMeta = topTracks.map(t => {
      const album = albums.find(a => a.id === t.albumId);
      return {
        ...t,
        artistName: artist.name,
        albumTitle: album?.title ?? "",
      };
    });

    res.json({ ...artist, albums: albumsWithMeta, topTracks: tracksWithMeta });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artist" });
  }
});

router.get("/albums", async (req, res) => {
  try {
    const artistId = req.query.artistId ? parseInt(req.query.artistId as string) : undefined;
    const artists = await db.select().from(artistsTable);
    const artistMap = new Map(artists.map(a => [a.id, a.name]));

    let query = db.select().from(albumsTable);
    const albums = artistId
      ? await db.select().from(albumsTable).where(eq(albumsTable.artistId, artistId))
      : await db.select().from(albumsTable);

    const tracks = await db.select().from(tracksTable);
    const trackCountMap = new Map<number, number>();
    for (const t of tracks) {
      trackCountMap.set(t.albumId, (trackCountMap.get(t.albumId) ?? 0) + 1);
    }

    const result = albums.map(a => ({
      ...a,
      artistName: artistMap.get(a.artistId) ?? "",
      trackCount: trackCountMap.get(a.id) ?? 0,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch albums" });
  }
});

router.get("/albums/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    const [album] = await db.select().from(albumsTable).where(eq(albumsTable.id, id));
    if (!album) {
      res.status(404).json({ error: "Album not found" });
      return;
    }
    const [artist] = await db.select().from(artistsTable).where(eq(artistsTable.id, album.artistId));
    const tracks = await db.select().from(tracksTable).where(eq(tracksTable.albumId, id));

    const tracksWithMeta = tracks.map(t => ({
      ...t,
      artistName: artist?.name ?? "",
      albumTitle: album.title,
    }));

    res.json({
      ...album,
      artistName: artist?.name ?? "",
      trackCount: tracks.length,
      tracks: tracksWithMeta,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch album" });
  }
});

router.get("/tracks", async (req, res) => {
  try {
    const albumId = req.query.albumId ? parseInt(req.query.albumId as string) : undefined;
    const artistId = req.query.artistId ? parseInt(req.query.artistId as string) : undefined;

    const artists = await db.select().from(artistsTable);
    const albums = await db.select().from(albumsTable);
    const artistMap = new Map(artists.map(a => [a.id, a.name]));
    const albumMap = new Map(albums.map(a => [a.id, a.title]));

    let tracks;
    if (albumId) {
      tracks = await db.select().from(tracksTable).where(eq(tracksTable.albumId, albumId));
    } else if (artistId) {
      tracks = await db.select().from(tracksTable).where(eq(tracksTable.artistId, artistId));
    } else {
      tracks = await db.select().from(tracksTable);
    }

    const result = tracks.map(t => ({
      ...t,
      artistName: artistMap.get(t.artistId) ?? "",
      albumTitle: albumMap.get(t.albumId) ?? "",
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

export default router;
