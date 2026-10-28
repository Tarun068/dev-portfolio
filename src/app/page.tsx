import { HeroCarousel } from "@/components/home/hero-carousel";
import { getFeatured } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        {site.name} — {site.taglines[0]}, {site.location}
      </h1>
      <HeroCarousel slides={getFeatured()} />
    </>
  );
}
