import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seedAdminSettings() {
  try {
    const defaults = [
      { key: "alwaysShowStartup", value: "false", description: "Always play boot sequence on every page load" },
      { key: "wallpaper", value: "xp-wallpaper.png", description: "Desktop wallpaper filename" },
      { key: "systemName", value: "NJAYCO OS", description: "OS display name shown in login screen" },
      { key: "desktopIconSize", value: "medium", description: "Size of desktop icons: small, medium, large" },
      { key: "allowGuestAccess", value: "true", description: "Allow guest login without credentials" },
      { key: "maintenanceMode", value: "false", description: "Put the OS into maintenance mode" },
    ];
    for (const setting of defaults) {
      await db.execute(
        sql`INSERT INTO admin_settings (key, value, description)
            VALUES (${setting.key}, ${setting.value}, ${setting.description})
            ON CONFLICT (key) DO NOTHING`
      );
    }
  } catch (_err) {
    logger.warn("Could not seed admin settings (table may not exist yet)");
  }
}

void seedAdminSettings();

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
