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
  /** Show in the home slider. Films and music videos stay on their own pages only (client request). */
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

/** A YouTube video: plays in the viewer, with its full-size YouTube thumbnail (1280×720) as the poster. */
const youtube = (id: string) => ({ youtubeId: id, poster: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` });

export const projects: Project[] = [
  // Films (client list, 2026-11-18)
  {
    slug: "katie",
    category: "films",
    title: "Katie",
    director: "Nathan Edward Wright",
    role: "Editor",
    shape: "landscape",
    ...youtube("D8BByEi_fKE"),
    summary: "Katie, an award-winning 48-hour horror film directed by Nathan Edward Wright. Edited by Dev Patel.",
  },
  {
    slug: "the-rat",
    category: "films",
    title: "The Rat",
    director: "Nathan Edward Wright",
    role: "Editor & DIT",
    shape: "landscape",
    ...youtube("qwPbjjoTsWw"),
    summary: "The Rat, an award-winning student crime film directed by Nathan Edward Wright. Edited by Dev Patel, who was also DIT.",
  },
  {
    slug: "the-visit",
    category: "films",
    title: "The Visit",
    director: "Dev Patel",
    role: "Writer & Editor",
    shape: "landscape",
    ...youtube("0REfNkr_Yt8"),
    summary: "The Visit, a short film written, directed and edited by Dev Patel.",
  },
  {
    slug: "barkin-dogs",
    category: "films",
    title: "Barkin’ Dogs",
    director: "Nathan Edward Wright",
    role: "Editor",
    shape: "landscape",
    ...youtube("xCi8siWSiqQ"),
    summary: "Barkin’ Dogs, a 48-hour comedy short film directed by Nathan Edward Wright. Edited by Dev Patel.",
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

  // Music videos (client list, 2026-11-18)
  {
    slug: "toxic-love",
    category: "music-videos",
    title: "Toxic Love",
    director: "Irene Garzón Rollán",
    role: "Editor",
    shape: "landscape",
    ...youtube("kvdL5XRVMEQ"),
    summary: "The official music video for A$iia’s “Toxic Love”, directed by Irene Garzón Rollán. Edited by Dev Patel.",
  },

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

export function projectHref(p: Pick<Project, "category" | "slug">) {
  return `/work/${p.category}/${p.slug}`;
}

export function categoryHref(slug: CategorySlug) {
  return `/work/${slug}`;
}
