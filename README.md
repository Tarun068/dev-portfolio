# Dev Patel — Portfolio

Portfolio site for Dev Patel (video editor & motion graphics, Toronto), built from the client layout `UI_02.pdf`.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Motion for React · Lenis (smooth scrolling) · next/image · Vimeo/YouTube embeds.

Smooth scrolling (`src/components/smooth-scroll.tsx`) eases mouse-wheel input only; touch scrolling stays native and reduced-motion users get normal scrolling. Scrollable areas inside the page need `data-lenis-prevent`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Pages (from the PDF)

| Route | PDF page | Notes |
| --- | --- | --- |
| `/` | 1 | Full-bleed showreel slider (featured projects), arrows, Download CV |
| `/work/films`, `/work/music-videos` | 2, 8 | Big rows: thumbnail + oversized title, "directed by", role |
| `/work/youtube-socials`, `/work/motion-stills` | 4–5, 9–10 | Heading words toggle between a 16:9 grid and a masonry grid |
| `/work/[category]/[slug]` | 3, 6, 7 | Dark project viewer. Opens as a modal over the grid (intercepted route) and as a full page on direct visits |
| `/bio` | 11 | Polaroid composition with hand-drawn notes and arrows |
| `/contact` | 12 | Contact form (server action) |

`/work` redirects to `/work/films`.

## Editing content

- **Projects:** `src/content/projects.ts`. Each project takes a `poster` (image in `/public`), a `vimeoId` / `youtubeId` / `videoSrc` for playback, an optional muted `previewSrc` loop (plays on hover and in the home hero), and `featured: true` to appear on the home slider. Without a poster, a placeholder frame is shown.
- **Home "Selected work" backgrounds:** each category's `cover` in `src/content/projects.ts`. These are currently placeholder Unsplash photos; swap them for stills from Dev's own work before launch (local files in `/public` need no extra config).
- **Site text, bio, taglines, portrait:** `src/content/site.ts`.
- **CV:** replace `public/cv/dev-patel-cv.pdf` (currently a placeholder).
- **Colours:** brand tokens in `src/app/globals.css` (`paper`, `ink`, `caption`, `sun`, `flame`, `sky`, `leaf`).

## Fonts

The design specifies **Futura PT**, which is a licensed font. Until licensed files (or an Adobe Fonts kit) are supplied, **Jost** (a free Futura-style typeface) is used. To switch, load Futura PT with `next/font/local` in `src/app/layout.tsx` and keep the `--font-futura` variable.

## Contact form

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Without them, messages are logged to the server console in development, and the form shows a "not connected yet" error in production.

## Deploying to Hostinger

This app needs a Node.js server (server action for the contact form, image optimisation, partial prerendering), so use a Hostinger plan with **Node.js web app** support (Business / Cloud):

- Build command: `npm run build`
- Start command: `npm start`
- Node version: 20 or newer
- Environment variables: those in `.env.example`, plus `NEXT_PUBLIC_SITE_URL` set to the live domain

Shared hosting without Node.js can only serve static files, which would need a static-export variant of the site.
