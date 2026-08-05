require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@iecep.org";
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, passwordHash, roles: JSON.stringify(["admin"]) },
  });

  console.log("Seeded admin user:");
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
  console.log("Log in at /admin/login with these credentials, then use the");
  console.log("Users tab to create other staff logins with limited roles.");
}

// Pre-fills the Leadership section with the board lineup that was
// previously hardcoded in About.jsx, so the public page looks unchanged
// until an admin edits it from the dashboard.
async function seedBoardMembers() {
  const count = await prisma.boardMember.count();
  if (count > 0) return;

  const members = [
    { role: "National President", name: "Engr. James Rodney Santiago, PECE" },
    { role: "VP for Internal Affairs", name: "Engr. Gemma Baysic, PECE" },
    { role: "VP for External Affairs", name: "Engr. Sherwin C. Ricaflanca, PECE" },
    { role: "VP for Education", name: "Engr. Jomer Catipon, ECE" },
    { role: "Secretary General", name: "Dr. Robert Joseph Licup, PECE" },
    { role: "Treasurer", name: "Engr. Albert Agu, PECE" },
    { role: "Auditor", name: "Engr. Paulo Lalaguna, PECE" },
    { role: "Director", name: "Engr. Rio Tubon, PECE" },
    { role: "Director", name: "Engr. Erwell Carlos, PECE" },
  ];
  for (const m of members) {
    await prisma.boardMember.create({ data: m });
  }
  console.log(`Seeded ${members.length} board members`);
}

async function seedAboutSettings() {
  const existing = await prisma.aboutSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return;

  await prisma.aboutSettings.create({
    data: {
      id: "singleton",
      leadership_image_url:
        "https://media.base44.com/images/public/6a71bda7bbd3a6eea5934e04/3ac26d558_generated_c5f7190f.png",
    },
  });
  console.log("Seeded About page leadership image setting");
}

async function main() {
  await seedAdmin();
  await seedBoardMembers();
  await seedAboutSettings();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
