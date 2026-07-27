import "server-only";
import { createHash } from "node:crypto";
import { getDatabaseClient } from "./client";

type PrivateBucket = "contracts" | "signed-contracts" | "photos" | "avatars" | "documents" | "guestbook" | "invoices";

export class SupabasePrivateStorageRepository {
  async upload(bucket: PrivateBucket, path: string, content: ArrayBuffer, contentType: string) {
    const { data, error } = await getDatabaseClient().storage.from(bucket).upload(path, content, {
      contentType,
      upsert: false,
      cacheControl: "private, max-age=0",
    });
    if (error) throw new Error(`STORAGE_UPLOAD_FAILED:${error.message}`);
    return {
      ...data,
      sha256: createHash("sha256").update(Buffer.from(content)).digest("hex"),
    };
  }

  async createDownloadUrl(bucket: PrivateBucket, path: string, expiresInSeconds = 300) {
    const safeExpiry = Math.min(900, Math.max(30, expiresInSeconds));
    const { data, error } = await getDatabaseClient().storage.from(bucket).createSignedUrl(path, safeExpiry);
    if (error) throw new Error(`STORAGE_URL_FAILED:${error.message}`);
    return data.signedUrl;
  }
}
