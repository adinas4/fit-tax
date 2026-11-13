import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.cakrawalaintiteknik.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/admin", "/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
