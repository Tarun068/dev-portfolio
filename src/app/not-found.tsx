import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-site flex flex-1 flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-[13px] uppercase tracking-[0.35em] text-caption">404</p>
      <h1 className="relative isolate text-[44px] font-semibold leading-none md:text-[64px]">
        <span className="absolute -left-[0.2em] -top-[0.14em] -z-10 size-[0.84em] rounded-full bg-flame" aria-hidden="true" />
        Cut! Wrong scene.
      </h1>
      <p className="max-w-md text-[18px]">This page didn’t make the final edit.</p>
      <Link href="/" className="mt-2 bg-ink px-8 py-3 text-paper" data-cursor="hover">
        Back to home
      </Link>
    </section>
  );
}
