import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@ideabymuha.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const passwordHash = await bcrypt.hash(password, 10);

  // If any admin already exists, just reset *that one's* password to the env value
  // so we know how to log in. This keeps things idempotent and avoids unique-constraint
  // collisions on username/email seeded by migrations.
  const existing = await prisma.admin.findFirst();

  if (existing) {
    const updated = await prisma.admin.update({
      where: { id: existing.id },
      data: { password: passwordHash },
    });
    console.log(`✅ Existing admin password reset.`);
    console.log(`   Login with: ${updated.email} / ${password}`);
    return;
  }

  const created = await prisma.admin.create({
    data: {
      email,
      username: email.split("@")[0],
      password: passwordHash,
      firstname: "Admin",
      lastname: "User",
      role: "admin",
    },
  });
  console.log(`✅ Admin created: ${created.email}`);
  console.log(`   Login with: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
