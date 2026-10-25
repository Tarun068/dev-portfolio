import { ProjectRow } from "@/components/work/project-row";
import type { Project } from "@/content/projects";

/** Films / Music Videos: thumbnail on the left, oversized title on the right, rows split by rules. */
export function ProjectList({ projects, accent }: { projects: Project[]; accent: string }) {
  return (
    <div className="container-site">
      {/* Inline-size container so rows can reserve the full card height (cqw units). */}
      <ul className="[container-type:inline-size]">
        {projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} accent={accent} last={i === projects.length - 1} />
        ))}
      </ul>
    </div>
  );
}
