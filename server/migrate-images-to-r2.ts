import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "./db";
import { menuItems } from "@shared/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "latavernetta";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_PUBLIC_URL) {
  console.error("Missing R2 environment variables!");
  console.error("Required: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_PUBLIC_URL");
  process.exit(1);
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return types[ext] || "application/octet-stream";
}

async function uploadToR2(filePath: string, filename: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const contentType = getContentType(filename);

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: `menu-images/${filename}`,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `${R2_PUBLIC_URL}/menu-images/${filename}`;
}

async function migrateImages() {
  console.log("Starting image migration to R2...\n");

  const items = await db.select().from(menuItems);
  const menuImagesDir = path.join(__dirname, "../public/menu-images");

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    if (!item.imageUrl) {
      skipped++;
      continue;
    }

    if (item.imageUrl.startsWith("http")) {
      console.log(`[SKIP] ${item.name} - already on R2`);
      skipped++;
      continue;
    }

    if (!item.imageUrl.startsWith("/menu-images/")) {
      console.log(`[SKIP] ${item.name} - not a menu image: ${item.imageUrl}`);
      skipped++;
      continue;
    }

    const filename = item.imageUrl.replace("/menu-images/", "");
    const localPath = path.join(menuImagesDir, filename);

    if (!fs.existsSync(localPath)) {
      console.log(`[FAIL] ${item.name} - file not found: ${localPath}`);
      failed++;
      continue;
    }

    try {
      const r2Url = await uploadToR2(localPath, filename);
      await db.update(menuItems).set({ imageUrl: r2Url }).where(eq(menuItems.id, item.id));
      console.log(`[OK] ${item.name} -> ${r2Url}`);
      migrated++;
    } catch (error) {
      console.error(`[FAIL] ${item.name} - upload error:`, error);
      failed++;
    }
  }

  console.log("\n=== Migration Complete ===");
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

migrateImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
