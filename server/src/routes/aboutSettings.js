const express = require("express");
const { prisma } = require("../db");
const { requireAuth, requireAnyRole } = require("../middleware/auth");

const router = express.Router();

const SINGLETON_ID = "singleton";

router.get("/", async (req, res) => {
  const settings = await prisma.aboutSettings.findUnique({ where: { id: SINGLETON_ID } });
  res.json({ leadership_image_url: settings?.leadership_image_url || null });
});

router.put("/", requireAuth, requireAnyRole("leadership"), async (req, res) => {
  const { leadership_image_url } = req.body || {};

  const settings = await prisma.aboutSettings.upsert({
    where: { id: SINGLETON_ID },
    update: { leadership_image_url },
    create: { id: SINGLETON_ID, leadership_image_url },
  });

  res.json({ leadership_image_url: settings.leadership_image_url || null });
});

module.exports = router;
