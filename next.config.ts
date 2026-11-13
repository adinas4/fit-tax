import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: "/fit-tax",
        assetPrefix: "/fit-tax",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox Preview Panel (served from *.space-z.ai) to load
  // Next.js dev assets (/_next/*, HMR) cross-origin. Without this, Next.js 16
  // blocks the requests and the preview fails to render.
  allowedDevOrigins: [
    "*.space-z.ai",
    "space-z.ai",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
