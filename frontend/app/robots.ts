import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/cart/", "/checkout/", "/admin/"],
      },
    ],
    sitemap: "https://ideabyido.com/sitemap.xml",
    host: "https://ideabyido.com",
  };
}
