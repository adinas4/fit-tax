import path from "path";
import fs from "fs";

/**
 * Resolve the directory where uploaded files are stored.
 *
 * Configurable via the UPLOADS_DIR environment variable so that, in production,
 * uploads can live in a persistent folder that survives application rebuilds
 * (e.g. outside the Next.js standalone build output).
 *
 * Defaults to `<project-root>/public/uploads` in development, which keeps the
 * existing behaviour of serving uploads as static files from /uploads/*.
 *
 * The directory is created on first access if it does not exist.
 */
let cached: string | null = null;

export function getUploadsDir(): string {
  if (cached) return cached;

  let dir = process.env.UPLOADS_DIR || "";
  if (!dir) {
    // Default: project-root/public/uploads (works in dev and standalone).
    dir = path.join(process.cwd(), "public", "uploads");
  }

  // Ensure it exists.
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    /* ignore — will surface on write */
  }

  cached = dir;
  return dir;
}

/**
 * The public URL prefix under which uploaded files are served.
 * Kept as /uploads so the existing <img src="/uploads/..."> references work
 * regardless of where the files physically live.
 */
export const UPLOADS_URL_PREFIX = "/uploads";
