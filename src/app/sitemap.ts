import type { MetadataRoute } from "next";
import { categories, categoryHref, projectHref, projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  return [
    { url: url("/"), priority: 1 },
    { url: url("/bio"), priority: 0.8 },
    { url: url("/contact"), priority: 0.6 },
    ...categories.map((c) => ({ url: url(categoryHref(c.slug)), priority: 0.9 })),
    ...projects.map((p) => ({ url: url(projectHref(p)), priority: 0.5 })),
  ];
}
