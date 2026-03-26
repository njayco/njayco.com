import { Router, type IRouter, type Request, type Response } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const router: IRouter = Router();

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

const signupSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(4),
  confirmPassword: z.string(),
  userType: z.enum(["client", "contractor", "employee"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post("/auth/signup", async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid input" });
    return;
  }

  const { username, email, password, userType } = parsed.data;

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      username,
      email,
      passwordHash,
      userType,
    }).returning();

    const token = generateToken();
    await db.insert(sessionsTable).values({
      token,
      userId: user.id,
      role: "user",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, userType: user.userType, role: "user" },
    });
  } catch (_err) {
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const { username, password } = parsed.data;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const token = generateToken();
    await db.insert(sessionsTable).values({
      token,
      userId: user.id,
      role: "user",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, userType: user.userType, role: "user" },
    });
  } catch (_err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/admin-login", async (req: Request, res: Response) => {
  const parsed = adminLoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const { username, password } = parsed.data;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username !== "njayco" || !adminPassword || password !== adminPassword) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }

  try {
    const token = generateToken();
    await db.insert(sessionsTable).values({
      token,
      userId: null,
      role: "admin",
    });

    res.json({
      token,
      user: { id: 0, username: "njayco", email: "", userType: "admin", role: "admin" },
    });
  } catch (_err) {
    res.status(500).json({ error: "Admin login failed" });
  }
});

router.get("/auth/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No session token" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.token, token)).limit(1);
    if (!session) {
      res.status(401).json({ error: "Invalid session" });
      return;
    }

    if (session.role === "admin") {
      res.json({
        user: { id: 0, username: "njayco", email: "", userType: "admin", role: "admin" },
      });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId)).limit(1);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json({
      user: { id: user.id, username: user.username, email: user.email, userType: user.userType, role: "user" },
    });
  } catch (_err) {
    res.status(500).json({ error: "Failed to restore session" });
  }
});

router.post("/auth/logout", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
    } catch (_err) {
      // ignore
    }
  }
  res.json({ ok: true });
});

export default router;
