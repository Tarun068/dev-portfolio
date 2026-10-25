import { HeroCarousel } from "@/components/home/hero-carousel";
import { WorkIndex, type WorkIndexItem } from "@/components/home/work-index";
import { accentHex, categories, categoryHref, getFeatured, getProjects } from "@/content/projects";
import { site } from "@/content/site";

// One row per Work category; the hover background is its cover image, or else its first
// featured project (or first project).
const workIndex: WorkIndexItem[] = categories.map((c) => {
  const list = getProjects(c.slug);
  return {
    slug: c.slug,
    href: categoryHref(c.slug),
    title: c.title,
    accent: accentHex[c.accent],
    count: list.length,
    cover: c.cover,
    preview: list.find((p) => p.featured) ?? list[0],
  };
});

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        {site.name} — {site.taglines[0]}, {site.location}
      </h1>
      <HeroCarousel slides={getFeatured()} />
      <WorkIndex items={workIndex} />
    </>
  );
}
