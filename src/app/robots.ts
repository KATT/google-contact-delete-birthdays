import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/", "/api/", "/contacts"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/auth/", "/api/", "/contacts"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
