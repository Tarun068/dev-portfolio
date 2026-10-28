/**
 * All portfolio content lives here. Replace the placeholder entries with real
 * projects: add a `poster` image (put files in /public/work/...), a `vimeoId`
 * (or `youtubeId` / `videoSrc`) for playback, and optionally a short muted
 * `previewSrc` loop that plays on hover and in the home hero.
 */

export type CategorySlug = "films" | "youtube-socials" | "music-videos" | "motion-stills";
export type Accent = "sun" | "flame" | "sky" | "leaf";

/** Frame shape. Drives aspect ratios in grids and the modal player. */
export type Shape = "landscape" | "vertical" | "portrait" | "square" | "wide";

export type Tab = { id: string; label: string; layout: "grid" | "masonry" };

export type Category = {
  slug: CategorySlug;
  title: string;
  accent: Accent;
  description: string;
  /** "list" = big rows (Films, Music Videos); "tabs" = two switchable grids. */
  layout: "list" | "tabs";
  tabs?: [Tab, Tab];
};

export type Project = {
  slug: string;
  category: CategorySlug;
  /** Which tab the project belongs to, for "tabs" categories. */
  tab?: string;
  title: string;
  director?: string;
  role?: string;
  year?: string;
  shape: Shape;
  /** Stills open as an image, everything else as a video. */
  kind?: "video" | "image";
  vimeoId?: string;
  youtubeId?: string;
  videoSrc?: string;
  previewSrc?: string;
  poster?: string;
  featured?: boolean;
  summary?: string;
};

export const accentHex: Record<Accent, string> = {
  sun: "#fbb03b",
  flame: "#e54141",
  sky: "#2d99ea",
  leaf: "#22b573",
};

export const shapeRatio: Record<Shape, number> = {
  landscape: 16 / 9,
  vertical: 9 / 16,
  portrait: 4 / 5,
  square: 1,
  wide: 2,
};

export const categories: Category[] = [
  {
    slug: "films",
    title: "Films",
    accent: "sun",
    layout: "list",
    description: "Short films edited and directed by Dev Patel.",
  },
  {
    slug: "youtube-socials",
    title: "Youtube/Socials",
    accent: "flame",
    layout: "tabs",
    tabs: [
      { id: "youtube", label: "Youtube", layout: "grid" },
      { id: "socials", label: "Socials", layout: "masonry" },
    ],
    description: "YouTube edits, reels, shorts and social-first content by Dev Patel.",
  },
  {
    slug: "music-videos",
    title: "Music Videos",
    accent: "sky",
    layout: "list",
    description: "Music videos edited by Dev Patel.",
  },
  {
    slug: "motion-stills",
    title: "Motion/Stills",
    accent: "leaf",
    layout: "tabs",
    tabs: [
      { id: "motion", label: "Motion", layout: "grid" },
      { id: "stills", label: "Stills", layout: "masonry" },
    ],
    description: "Motion graphics, animation and still photography by Dev Patel.",
  },
];

// Vimeo's public demo clip, used only so the player can be previewed. Replace it.
const DEMO_VIMEO = "76979871";

export const projects: Project[] = [
  // Films
  {
    slug: "the-visit",
    category: "films",
    title: "The Visit",
    director: "Dev Patel",
    role: "Editor",
    shape: "landscape",
    vimeoId: DEMO_VIMEO,
    featured: true,
  },
  {
    slug: "barkin-dogs",
    category: "films",
    title: "Barkin’ Dogs",
    director: "Nathan Edward Wright",
    role: "Editor",
    shape: "landscape",
    featured: true,
  },
  {
    slug: "short-film-three",
    category: "films",
    title: "Title",
    director: "XYZ",
    role: "Editor",
    shape: "landscape",
  },

  // Youtube
  { slug: "channel-trailer", category: "youtube-socials", tab: "youtube", title: "Channel Trailer", role: "Editor", shape: "landscape", featured: true },
  { slug: "travel-vlog", category: "youtube-socials", tab: "youtube", title: "Travel Vlog", role: "Editor", shape: "landscape" },
  { slug: "tech-review", category: "youtube-socials", tab: "youtube", title: "Tech Review", role: "Editor & Motion", shape: "landscape" },
  { slug: "podcast-highlights", category: "youtube-socials", tab: "youtube", title: "Podcast Highlights", role: "Editor", shape: "landscape" },

  // Socials
  { slug: "reel-01", category: "youtube-socials", tab: "socials", title: "Reel 01", shape: "square" },
  { slug: "reel-02", category: "youtube-socials", tab: "socials", title: "Reel 02", shape: "vertical" },
  { slug: "reel-03", category: "youtube-socials", tab: "socials", title: "Reel 03", shape: "square" },
  { slug: "reel-04", category: "youtube-socials", tab: "socials", title: "Reel 04", shape: "square" },
  { slug: "reel-05", category: "youtube-socials", tab: "socials", title: "Reel 05", shape: "vertical" },
  { slug: "reel-06", category: "youtube-socials", tab: "socials", title: "Reel 06", shape: "vertical" },
  { slug: "reel-07", category: "youtube-socials", tab: "socials", title: "Reel 07", shape: "square" },
  { slug: "reel-08", category: "youtube-socials", tab: "socials", title: "Reel 08", shape: "portrait" },
  { slug: "reel-09", category: "youtube-socials", tab: "socials", title: "Reel 09", shape: "portrait" },
  { slug: "reel-10", category: "youtube-socials", tab: "socials", title: "Reel 10", shape: "square" },

  // Music videos
  {
    slug: "music-video-one",
    category: "music-videos",
    title: "Title",
    director: "XYZ",
    role: "Editor",
    shape: "landscape",
    vimeoId: DEMO_VIMEO,
    featured: true,
  },
  { slug: "music-video-two", category: "music-videos", title: "Title", director: "XYZ", role: "Editor", shape: "landscape" },
  { slug: "music-video-three", category: "music-videos", title: "Title", director: "XYZ", role: "Colorist", shape: "landscape" },

  // Motion
  { slug: "logo-reveal", category: "motion-stills", tab: "motion", title: "Logo Reveal", role: "Motion Graphics", shape: "landscape", featured: true },
  { slug: "kinetic-type", category: "motion-stills", tab: "motion", title: "Kinetic Type", role: "Motion Graphics", shape: "landscape" },
  { slug: "title-sequence", category: "motion-stills", tab: "motion", title: "Title Sequence", role: "Motion Graphics", shape: "landscape" },
  { slug: "explainer", category: "motion-stills", tab: "motion", title: "Explainer", role: "Animation", shape: "landscape" },

  // Stills
  { slug: "still-01", category: "motion-stills", tab: "stills", title: "Still 01", shape: "square", kind: "image" },
  { slug: "still-02", category: "motion-stills", tab: "stills", title: "Still 02", shape: "vertical", kind: "image" },
  { slug: "still-03", category: "motion-stills", tab: "stills", title: "Still 03", shape: "wide", kind: "image" },
  { slug: "still-04", category: "motion-stills", tab: "stills", title: "Still 04", shape: "vertical", kind: "image" },
  { slug: "still-05", category: "motion-stills", tab: "stills", title: "Still 05", shape: "vertical", kind: "image" },
  { slug: "still-06", category: "motion-stills", tab: "stills", title: "Still 06", shape: "square", kind: "image" },
  { slug: "still-07", category: "motion-stills", tab: "stills", title: "Still 07", shape: "portrait", kind: "image" },
  { slug: "still-08", category: "motion-stills", tab: "stills", title: "Still 08", shape: "square", kind: "image" },
  { slug: "still-09", category: "motion-stills", tab: "stills", title: "Still 09", shape: "portrait", kind: "image" },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProject(category: string, slug: string) {
  return projects.find((p) => p.category === category && p.slug === slug);
}

export function getProjects(category: CategorySlug, tab?: string) {
  return projects.filter((p) => p.category === category && (tab === undefined || p.tab === tab));
}

export function getFeatured() {
  return projects.filter((p) => p.featured);
}

/** Previous/next project within the same category (and tab), wrapping around. */
export function getSiblings(project: Project) {
  const list = getProjects(project.category, project.tab);
  const i = list.findIndex((p) => p.slug === project.slug);
  return {
    prev: list[(i - 1 + list.length) % list.length],
    next: list[(i + 1) % list.length],
    index: i,
    total: list.length,
  };
}

export function projectHref(p: Pick<Project, "category" | "slug">) {
  return `/work/${p.category}/${p.slug}`;
}

export function categoryHref(slug: CategorySlug) {
  return `/work/${slug}`;
}
