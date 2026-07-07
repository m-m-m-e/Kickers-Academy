import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const projectRoot = process.cwd();
const candidates = [
  path.join(projectRoot, "prisma", "prisma", "dev.db"),
  path.join(projectRoot, "prisma", "dev.db"),
  path.join(projectRoot, "data", "site.db")
];

function openDatabase(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return new Database(filePath, { readonly: true });
}

function readSitePayload(db) {
  const tableNames = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
    .all()
    .map((row) => row.name);

  if (tableNames.includes("SiteContent")) {
    const row = db.prepare('SELECT payload FROM "SiteContent" WHERE "key" = ?').get("site");
    return row?.payload ?? null;
  }

  if (tableNames.includes("site_content")) {
    const columnNames = db.prepare("PRAGMA table_info(site_content)").all().map((row) => row.name);
    if (columnNames.includes("content_key")) {
      const row = db.prepare("SELECT payload FROM site_content WHERE content_key = ?").get("site");
      return row?.payload ?? null;
    }
    if (columnNames.includes("key")) {
      const row = db.prepare('SELECT payload FROM site_content WHERE "key" = ?').get("site");
      return row?.payload ?? null;
    }
  }

  return null;
}

async function main() {
  let payload = null;
  let source = null;

  for (const candidate of candidates) {
    const db = openDatabase(candidate);
    if (!db) continue;

    try {
      payload = readSitePayload(db);
      if (payload) {
        source = candidate;
        break;
      }
    } finally {
      db.close();
    }
  }

  if (!payload) {
    console.log("No legacy site content payload was found. Nothing to migrate.");
    return;
  }

  const row = await prisma.siteContent.upsert({
    where: { key: "site" },
    create: { key: "site", payload },
    update: { payload }
  });

  console.log(`Migrated site content from ${source}`);
  console.log(`Saved row ${row.id} for key ${row.key}`);
}

main()
  .catch((error) => {
    console.error("Site content migration failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
