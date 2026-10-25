import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectViewer } from "@/components/work/project-viewer";
import { accentHex, categoryHref, getCategory, getProject, getSiblings, projectHref } from "@/content/projects";

/** Shared by the standalone project page and the intercepted modal route. */
export async function ProjectViewerRoute({
  params,
  mode,
}: {
  params: Promise<{ category: string; slug: string }>;
  mode: "modal" | "page";
}) {
  const { category, slug } = await params;
  const cat = getCategory(category);
  const project = getProject(category, slug);
  if (!cat || !project) notFound();

  const { prev, next, index, total } = getSiblings(project);
  const tabLabel = cat.tabs?.find((t) => t.id === project.tab)?.label;

  return (
    <ProjectViewer
      project={project}
      prev={prev}
      next={next}
      index={index}
      total={total}
      accent={accentHex[cat.accent]}
      label={tabLabel ?? cat.title}
      closeHref={categoryHref(cat.slug)}
      mode={mode}
    />
  );
}

export async function projectMetadata(params: Promise<{ category: string; slug: string }>): Promise<Metadata> {
  const { category, slug } = await params;
  const project = getProject(category, slug);
  const cat = getCategory(category);
  if (!project || !cat) return {};

  const credit = [project.role, project.director && `directed by ${project.director}`].filter(Boolean).join(", ");
  const description = project.summary ?? `${project.title} — ${cat.title}${credit ? ` (${credit})` : ""}. Work by Dev Patel.`;

  return {
    title: `${project.title} · ${cat.title}`,
    description,
    alternates: { canonical: projectHref(project) },
    openGraph: {
      type: project.kind === "image" ? "article" : "video.other",
      title: project.title,
      description,
      url: projectHref(project),
      images: project.poster ? [{ url: project.poster }] : undefined,
    },
  };
}
