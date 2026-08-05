const express = require("express");
const bcrypt = require("bcryptjs");
const { prisma } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { parseRoles, serializeRoles } = require("../lib/roles");

const router = express.Router();

// Every route here is admin-only: this is where admins create the staff
// logins (chapter coordinators, students corner editors, etc.) — there is
// no public sign-up.
router.use(requireAuth, requireAdmin);

function serialize(user) {
  return { id: user.id, email: user.email, roles: parseRoles(user.roles), created_date: user.createdAt };
}

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  res.json(users.map(serialize));
});

router.post("/", async (req, res) => {
  const { email, password, roles } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }
  if (!Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "At least one role is required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "An account with this email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, roles: serializeRoles(roles) },
  });

  res.status(201).json(serialize(user));
});

router.patch("/:id/roles", async (req, res) => {
  const { roles } = req.body || {};
  if (!Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({ message: "At least one role is required" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { roles: serializeRoles(roles) },
    });
    res.json(serialize(user));
  } catch {
    res.status(404).json({ message: "User not found" });
  }
});

router.delete("/:id", async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
