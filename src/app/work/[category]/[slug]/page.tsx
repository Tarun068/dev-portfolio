import { Suspense } from "react";
import { ProjectViewerRoute, projectMetadata } from "@/components/work/project-viewer-route";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[category]/[slug]">) {
  return projectMetadata(params);
}

export default function ProjectPage({ params }: PageProps<"/work/[category]/[slug]">) {
  return (
    <Suspense fallback={null}>
      <ProjectViewerRoute params={params} mode="page" />
    </Suspense>
  );
}
