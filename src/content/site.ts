export const site = {
  name: "Dev Patel",
  // The header rotates through these (the PDF uses both lines on different pages).
  taglines: ["Video Editor and Motion Graphics", "Visual Creator - Toronto, CA Based."],
  description:
    "Dev Patel is a Toronto-based video editor and motion graphics artist crafting short films, music videos, YouTube and social content, motion design and stills.",
  location: "Toronto, CA",
  cvPath: "/cv/dev-patel-cv.pdf",
  // Bio photo, e.g. "/images/dev-patel.jpg" (placed in /public). Null shows a placeholder.
  portrait: null as string | null,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  bio: [
    "I create meaningful visuals, from short films and animation to digital content designed to engage and entertain. My work blends editing, motion graphics, color grading, and sound design to bring ideas to life on screen.",
    "If it moves, glows, cuts, or tells a story, I’m into it!",
  ],
} as const;

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Bio", href: "/bio" },
  { label: "Contact", href: "/contact" },
] as const;
