import { Suspense } from "react";
import { ProjectViewerRoute, projectMetadata } from "@/components/work/project-viewer-route";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ category: p.category, slug: p.slug }));
}

type Params = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Params) {
  return projectMetadata(params);
}

// Soft navigations to a project open it over the current page instead of leaving it.
// No fallback: the viewer runs its own reveal animation once the content is there.
export default function ProjectModal({ params }: Params) {
  return (
    <Suspense fallback={null}>
      <ProjectViewerRoute params={params} mode="modal" />
    </Suspense>
  );
}
