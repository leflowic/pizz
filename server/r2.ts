import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "latavernetta";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

let s3Client: S3Client | null = null;

export function isR2Configured(): boolean {
  return !!(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_ENDPOINT);
}

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!isR2Configured()) {
      throw new Error("R2 is not configured. Missing environment variables.");
    }
    
    s3Client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3Client;
}

export async function uploadToR2(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const client = getS3Client();
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: filename,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await client.send(command);
  
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${filename}`;
  }
  
  return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${filename}`;
}

export async function deleteFromR2(filename: string): Promise<void> {
  const client = getS3Client();
  
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: filename,
  });

  await client.send(command);
}

export function getR2PublicUrl(filename: string): string {
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${filename}`;
  }
  return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${filename}`;
}
