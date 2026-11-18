# Dev Patel — Portfolio

Portfolio site for Dev Patel (video editor & motion graphics, Toronto), built from the client layout `UI_02.pdf`.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Motion for React · Lenis (smooth scrolling) · Adobe Fonts (Futura PT, Skia) · next/image · Vimeo/YouTube embeds.

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
| `/work/[category]/[slug]` | 3, 6, 7 | Dark project viewer. Opens as a modal over the grid (intercepted route) and as a full page on direct visits. A black curtain drops in on open and lifts on close (timings from the O Positive reference). Youtube/Socials and Motion/Stills get prev/next arrows, which swap the project in place and update the URL |
| `/bio` | 11 | Polaroid composition with hand-drawn notes and arrows |
| `/contact` | 12 | Contact form (server action) |

`/work` redirects to `/work/films`.

## Editing content

- **Projects:** `src/content/projects.ts`. Each project takes a `poster` (image in `/public`), a `vimeoId` / `youtubeId` / `videoSrc` for playback, an optional muted `previewSrc` loop (plays on hover and in the home hero), and `featured: true` to appear on the home slider. Without a poster, a placeholder frame is shown.
- **Site text, bio, taglines, portrait:** `src/content/site.ts`.
- **Logo:** the client's DP monogram as SVG path data in `src/components/brand/logo-paths.ts` (traced from their PNG). It plays on the intro screen (`src/components/intro-loader.tsx`), once per browser session, sized so its edges land on whole screen pixels. It is also the site icon: `public/favicon.ico` holds a pixel-fitted frame for each tab size (16, 20, 24, 32, 40, 48, 64px — i.e. 100% to 300% display scaling) and `public/apple-touch-icon.png` (180px) is the iPhone home-screen icon; both are declared in `metadata.icons` in `src/app/layout.tsx`. Each frame is drawn at its own size rather than scaled from one image, which is what keeps it sharp.
- **CV:** replace `public/cv/dev-patel-cv.pdf` (currently a placeholder).
- **Colours:** brand tokens in `src/app/globals.css` (`paper`, `ink`, `caption`, `sun`, `flame`, `sky`, `leaf`).
- **Page spacing:** one vertical gap, `--page-edge` in `src/app/globals.css` (70px desktop, 48px tablet, 24px phone), as in the client PDF: top of the page to the nav, the nav to the first content, between the main blocks (e.g. slider to Download CV, a title to its content, the viewer's Close / media / title) and the last content to the bottom. It is measured between visible edges: the nav box (not the tagline), media and buttons, a title's dot and baseline. Bio and Contact centre their visible content between the nav and the bottom.

## Fonts

Fonts come from the client's **Adobe Fonts web project** (`https://use.typekit.net/xks4ram.css`, linked in `src/app/layout.tsx`), which is the licensed way to use them on the web:

- **Futura PT** (`futura-pt`): Book 400 for navigation, forms, sub headings, captions (21px on desktop) and the Bio text (24px); Demi 600 for titles (48px) and the name; Bold 700 for the Contact heading. Light, Medium and Heavy are also in the kit.
- **Skia Condensed** (`skia-cc-condensed`): the handwritten-style notes on the Bio page ("Hello!", "Every frame has a story.").

The font families are set in `src/app/globals.css` (`--font-sans`, `--font-hand`). Adobe Fonts kits can't be self-hosted; the kit is managed in the client's Adobe account.

The social share image (`src/app/opengraph-image.tsx`) is generated on the server and can't use the kit, so it uses the Futura PT Book/Demi `.ttf` files in `src/fonts/`.

## Contact form

Messages are emailed through **Gmail's SMTP server** (Nodemailer, in `src/app/contact/actions.ts`); nothing is stored. Each one arrives as "New message from (name)", with Reply-To set to the visitor so pressing Reply answers them.

1. On the sending Google account, turn on 2-Step Verification, then create an **App Password** (Google Account → Security → 2-Step Verification → App passwords). The normal Gmail password won't work.
2. Copy `.env.example` to `.env.local` (and add the same variables on the host): `SMTP_USER` = the Gmail address, `SMTP_PASS` = the App Password, `CONTACT_TO_EMAIL` = the inbox that receives messages (defaults to `SMTP_USER`).
3. Restart the server and send a test message.

Without these, messages are logged to the server console in development, and the form shows a "not connected yet" error in production. `.env.local` is git-ignored; never commit the App Password. A regular Gmail account can send about 500 emails a day.

## Deploying to Hostinger

This app needs a Node.js server (server action for the contact form, image optimisation, partial prerendering), so use a Hostinger plan with **Node.js web app** support (Business / Cloud):

- Build command: `npm run build`
- Start command: `npm start`
- Node version: 20 or newer
- Environment variables: those in `.env.example`, plus `NEXT_PUBLIC_SITE_URL` set to the live domain

Shared hosting without Node.js can only serve static files, which would need a static-export variant of the site.
