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
    <section className="flex flex-1 flex-col pb-10 lg:pb-16">
      <h1 className="sr-only">About {site.name}</h1>
      <BioComposition />
    </section>
  );
}
