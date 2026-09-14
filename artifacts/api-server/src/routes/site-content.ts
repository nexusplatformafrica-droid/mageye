import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, siteContentTable } from "@workspace/db";

const router: IRouter = Router();
const CONTENT_ID = "mageye-main";

router.get("/site-content", async (_req, res, next) => {
  try {
    const [record] = await db
      .select({ payload: siteContentTable.payload })
      .from(siteContentTable)
      .where(eq(siteContentTable.id, CONTENT_ID))
      .limit(1);

    res.json({ content: record?.payload ?? null });
  } catch (error) {
    next(error);
  }
});

router.put("/site-content", async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      res.status(400).json({ message: "A site content object is required." });
      return;
    }

    const [record] = await db
      .insert(siteContentTable)
      .values({
        id: CONTENT_ID,
        payload: req.body,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteContentTable.id,
        set: {
          payload: req.body,
          updatedAt: new Date(),
        },
      })
      .returning({
        updatedAt: siteContentTable.updatedAt,
      });

    res.json({ ok: true, updatedAt: record?.updatedAt ?? new Date() });
  } catch (error) {
    next(error);
  }
});

export default router;