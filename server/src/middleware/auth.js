const { verifyAuthToken } = require("../lib/tokens");
const { parseRoles } = require("../lib/roles");
const { prisma } = require("../db");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ message: "Authentication required" });
    req.user = user;
    req.userRoles = parseRoles(user.roles);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.userRoles?.includes("admin")) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// Allows the request through if the user has "admin" or any of the given
// roles. Use requireAnyRole("chapters") to gate a single-role write, or
// requireAnyRole(...several) if more than one role should qualify.
function requireAnyRole(...roles) {
  return (req, res, next) => {
    const ok = req.userRoles?.includes("admin") || roles.some((r) => req.userRoles?.includes(r));
    if (!ok) return res.status(403).json({ message: "Insufficient permissions" });
    next();
  };
}

module.exports = { requireAuth, requireAdmin, requireAnyRole };
