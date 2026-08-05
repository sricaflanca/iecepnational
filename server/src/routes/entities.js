const express = require("express");
const { prisma } = require("../db");
const { requireAuth, requireAnyRole } = require("../middleware/auth");
const { ENTITY_ROLE } = require("../lib/roles");

const router = express.Router();

// Must match the model names in prisma/schema.prisma exactly (also the
// names src/pages/**/*.jsx call via base44.entities.<Name>).
const ALLOWED_ENTITIES = [
  "BoardMember",
  "ChapterEvent",
  "CorporateMember",
  "Event",
  "IECEPistle",
  "Member",
  "Partner",
  "Resolution",
  "SocialEvent",
  "Specialization",
  "StudentActivity",
];

function getModel(entityName) {
  if (!ALLOWED_ENTITIES.includes(entityName)) return null;
  // Prisma Client exposes each model as its name with only the first
  // character lowercased, e.g. IECEPistle -> prisma.iECEPistle.
  const accessor = entityName.charAt(0).toLowerCase() + entityName.slice(1);
  return prisma[accessor];
}

// base44-style sort strings: "-start_date" (desc) or "full_name" (asc).
function parseSort(sortParam) {
  if (!sortParam) return { created_date: "desc" };
  const desc = sortParam.startsWith("-");
  const field = desc ? sortParam.slice(1) : sortParam;
  return { [field]: desc ? "desc" : "asc" };
}

async function listHandler(req, res) {
  const model = getModel(req.params.entity);
  if (!model) return res.status(404).json({ message: "Unknown entity" });

  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const orderBy = parseSort(req.query.sort);

  try {
    const records = await model.findMany({ take: limit, orderBy });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load records" });
  }
}

router.get("/:entity", listHandler);
router.get("/:entity/filter", listHandler);

// The role required to write a given entity is looked up per-request (not a
// static middleware list) since it depends on the :entity route param.
function requireEntityRole(req, res, next) {
  const role = ENTITY_ROLE[req.params.entity] || "admin";
  return requireAnyRole(role)(req, res, next);
}

router.post("/:entity", requireAuth, requireEntityRole, async (req, res) => {
  const model = getModel(req.params.entity);
  if (!model) return res.status(404).json({ message: "Unknown entity" });

  try {
    const record = await model.create({ data: req.body || {} });
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to create record" });
  }
});

router.put("/:entity/:id", requireAuth, requireEntityRole, async (req, res) => {
  const model = getModel(req.params.entity);
  if (!model) return res.status(404).json({ message: "Unknown entity" });

  try {
    const record = await model.update({ where: { id: req.params.id }, data: req.body || {} });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to update record" });
  }
});

router.delete("/:entity/:id", requireAuth, requireEntityRole, async (req, res) => {
  const model = getModel(req.params.entity);
  if (!model) return res.status(404).json({ message: "Unknown entity" });

  try {
    await model.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to delete record" });
  }
});

module.exports = router;
