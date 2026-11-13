import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getUploadsDir } from "@/lib/uploads";

// MIME map for the few image types we allow.
const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/**
 * Serves uploaded files from the (possibly persistent) uploads directory.
 *
 * In development the files live in `public/uploads` and Next.js serves them
 * as static assets — this route is only hit when UPLOADS_DIR points outside
 * `public` (typical in production so uploads survive application rebuilds).
 *
 * The path is validated to prevent directory traversal.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await ctx.params;

  // Reject empty or traversal attempts.
  if (!segments || segments.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const safeName = segments
    .map((s) => s.replace(/[^a-zA-Z0-9._-]/g, ""))
    .filter(Boolean)
    .join("/");
  if (!safeName || safeName.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const uploadsDir = getUploadsDir();
  const filepath = path.resolve(uploadsDir, safeName);

  // Ensure the resolved path is still inside the uploads dir.
  if (!filepath.startsWith(path.resolve(uploadsDir) + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await readFile(filepath);
    const ext = path.extname(filepath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
