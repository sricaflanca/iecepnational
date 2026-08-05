// Role catalog for the admin dashboard. "admin" has full access, including
// user management. Every other role gates exactly one content tab/entity —
// a user can hold multiple.
const ROLES = [
  "admin",
  "resolutions",
  "events",
  "iecepistle",
  "chapters",
  "social",
  "students",
  "specializations",
  "partners",
  "leadership",
];

// Which role is required to create/delete records of each entity. Entities
// with no dedicated admin tab (CorporateMember, Member) are admin-only.
const ENTITY_ROLE = {
  Resolution: "resolutions",
  Event: "events",
  IECEPistle: "iecepistle",
  ChapterEvent: "chapters",
  SocialEvent: "social",
  StudentActivity: "students",
  Specialization: "specializations",
  Partner: "partners",
  CorporateMember: "admin",
  Member: "admin",
  BoardMember: "leadership",
};

function parseRoles(json) {
  try {
    const arr = JSON.parse(json || "[]");
    return Array.isArray(arr) ? arr.filter((r) => ROLES.includes(r)) : [];
  } catch {
    return [];
  }
}

function serializeRoles(roles) {
  const unique = Array.from(new Set((roles || []).filter((r) => ROLES.includes(r))));
  return JSON.stringify(unique);
}

module.exports = { ROLES, ENTITY_ROLE, parseRoles, serializeRoles };
