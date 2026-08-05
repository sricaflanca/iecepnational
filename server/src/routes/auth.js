const express = require("express");
const bcrypt = require("bcryptjs");
const { prisma } = require("../db");
const { signAuthToken, generateResetToken } = require("../lib/tokens");
const { parseRoles } = require("../lib/roles");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const RESET_TTL_MS = 60 * 60 * 1000;

function serializeUser(user) {
  return { id: user.id, email: user.email, roles: parseRoles(user.roles) };
}

// Dev-mode "email" — logs to the server console and echoes details back in
// the response so password recovery works end-to-end without real SMTP.
function devSendEmail(label, email, details) {
  console.log(`\n[DEV EMAIL] ${label} -> ${email}`);
  for (const [k, v] of Object.entries(details)) console.log(`  ${k}: ${v}`);
  console.log("");
}

// No public registration: accounts are created by an admin from the Users
// tab (see routes/adminUsers.js). This site's login is staff-only.

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid email or password" });

  const access_token = signAuthToken(user);
  res.json({ access_token, user: serializeUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  res.json(serializeUser(req.user));
});

// Self-service password change — any authenticated user, any role, no
// separate reset link needed. Requires the current password.
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current and new password are required" });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters" });
  }

  const valid = await bcrypt.compare(currentPassword, req.user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });

  res.json({ message: "Password updated" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetToken = generateResetToken();
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TTL_MS);
    await prisma.user.update({ where: { email }, data: { resetToken, resetTokenExpiresAt } });
    devSendEmail("Password reset", email, {
      token: resetToken,
      link: `http://localhost:5173/reset-password?token=${resetToken}`,
      expires_in: "1 hour",
    });
  }

  // Always respond success so we don't leak which emails are registered.
  res.json({ message: "If an account exists, a reset link has been sent" });
});

router.post("/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body || {};
  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "Reset token and new password are required" });
  }
  if (String(newPassword).length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  const user = await prisma.user.findFirst({ where: { resetToken } });
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return res.status(400).json({ message: "This reset link is invalid or has expired" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
  });

  res.json({ message: "Password updated" });
});

module.exports = router;
