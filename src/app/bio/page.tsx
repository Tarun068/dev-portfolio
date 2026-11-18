import type { Metadata } from "next";
import { BioComposition } from "@/components/bio/bio-composition";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Bio",
  description: site.bio.join(" "),
  alternates: { canonical: "/bio" },
};

export default function BioPage() {
  return (
    // Centred between the nav and the bottom of the screen, never closer than the page gap to either.
    <section className="page-pb flex flex-1 flex-col justify-center">
      <h1 className="sr-only">About {site.name}</h1>
      <BioComposition />
    </section>
  );
}
