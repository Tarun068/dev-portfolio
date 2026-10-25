import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectList } from "@/components/work/project-list";
import { SectionTitle } from "@/components/work/section-title";
import { WorkTabs } from "@/components/work/work-tabs";
import { accentHex, categories, getCategory, getProjects } from "@/content/projects";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `/work/${cat.slug}` },
    openGraph: { title: cat.title, description: cat.description, url: `/work/${cat.slug}` },
  };
}

async function CategoryContent({ params }: Pick<PageProps<"/work/[category]">, "params">) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const accent = accentHex[cat.accent];

  if (cat.layout === "tabs" && cat.tabs) {
    const projectsByTab = Object.fromEntries(cat.tabs.map((t) => [t.id, getProjects(cat.slug, t.id)]));
    return <WorkTabs id={cat.slug} accent={accent} tabs={cat.tabs} projectsByTab={projectsByTab} />;
  }

  return (
    <>
      <div className="container-site mb-8 mt-4 md:mb-[46px] md:mt-[46px]">
        <SectionTitle id={cat.slug} accent={accent} items={[{ id: cat.slug, label: cat.title }]} active={cat.slug} />
      </div>
      <ProjectList projects={getProjects(cat.slug)} accent={accent} />
    </>
  );
}

export default function WorkCategoryPage({ params }: PageProps<"/work/[category]">) {
  // URL data stays inside Suspense so the shared App Shell remains instant; links into
  // this route use prefetch so the content is usually ready before the click.
  return (
    <section className="pb-24 md:pb-32">
      <Suspense fallback={<div className="min-h-[70svh]" />}>
        <CategoryContent params={params} />
      </Suspense>
    </section>
  );
}
