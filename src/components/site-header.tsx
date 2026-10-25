"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { navItems, site } from "@/content/site";
import { accentHex, categories, categoryHref } from "@/content/projects";
import { cn, easeOutExpo } from "@/lib/utils";

function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % site.taglines.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="relative block h-[1.35em] overflow-hidden text-[16px] text-caption sm:text-[19px] lg:text-[21px]">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          className="block whitespace-nowrap"
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          {site.taglines[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Text that rolls up to a duplicate of itself on hover (the inner stack is two lines tall, so move it by half). */
function RollText({ children }: { children: string }) {
  return (
    <span className="relative block h-[1.25em] overflow-hidden leading-[1.25em]">
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2">
        <span className="block">{children}</span>
        <span className="block" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}

// The Work sub-menu opens on hover (or focus) on every page, in its own panel so it reads over any content.
const menuVariants = {
  show: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.45, ease: easeOutExpo, staggerChildren: 0.04, delayChildren: 0.05 },
  },
  hidden: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.3, ease: easeOutExpo, staggerChildren: 0.02, staggerDirection: -1 },
  },
};

function WorkMenu({ pathname, open }: { pathname: string; open: boolean }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.ul
          key="work-menu"
          className="absolute right-0 top-full z-30 hidden flex-col items-end border border-ink bg-paper py-3 pl-6 pr-5 shadow-[0_24px_48px_-28px_rgba(15,6,6,0.55)] md:flex"
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={menuVariants}
        >
          {categories.map((c) => {
            const href = categoryHref(c.slug);
            const isActive = pathname.startsWith(href);
            return (
              <motion.li
                key={c.slug}
                variants={{
                  hidden: { opacity: 0, x: 16, filter: "blur(4px)" },
                  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: easeOutExpo } },
                }}
              >
                <Link
                  href={href}
                  prefetch
                  className="group/item relative flex items-center gap-2 whitespace-nowrap py-[2px] text-[17px] leading-[1.45] lg:text-[19px]"
                  data-cursor="hover"
                >
                  {isActive ? (
                    <motion.span
                      layoutId="work-menu-dot"
                      className="size-2 rounded-full"
                      style={{ background: accentHex[c.accent] }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  ) : (
                    <span
                      className="size-2 scale-0 rounded-full transition-transform duration-300 group-hover/item:scale-100"
                      style={{ background: accentHex[c.accent] }}
                    />
                  )}
                  <span className="transition-transform duration-300 group-hover/item:-translate-x-1">{c.title}</span>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      ) : null}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const onWork = pathname.startsWith("/work");
  const activeHref =
    pathname === "/" ? "/" : navItems.find((n) => n.href !== "/" && pathname.startsWith(n.href))?.href;

  // Hover dropdown for Work. Keyed to the pathname so it closes after navigating.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const workOpen = openAt === pathname;

  return (
    <header className="container-site relative z-40 pb-6 pt-6 md:pb-10 md:pt-12 lg:pb-[52px] lg:pt-[70px]">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <Link href="/" className="group block w-fit" aria-label={`${site.name} — home`} data-cursor="hover">
          <span className="block text-[34px] font-semibold leading-[1] tracking-[-0.01em] sm:text-[40px] lg:text-[48px]">
            {site.name.split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-[0.12em]"
                style={{ transitionDelay: `${i * 22}ms` }}
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
          <RotatingTagline />
        </Link>

        <nav aria-label="Main">
          <ul className="relative grid grid-cols-4 border border-ink">
            {navItems.map((item) => {
              const isActive = activeHref === item.href;
              const isWork = item.href === "/work";
              return (
                <li
                  key={item.href}
                  className="relative"
                  onPointerEnter={isWork ? () => setOpenAt(pathname) : undefined}
                  onPointerLeave={isWork ? () => setOpenAt(null) : undefined}
                  onFocus={isWork ? () => setOpenAt(pathname) : undefined}
                  onKeyDown={isWork ? (e) => e.key === "Escape" && setOpenAt(null) : undefined}
                  onBlur={
                    isWork
                      ? (e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenAt(null);
                        }
                      : undefined
                  }
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex h-[46px] items-center justify-center text-[16px] transition-colors duration-300 sm:h-[52px] md:w-[140px] lg:w-[162px] lg:text-[20px]",
                      isActive ? "text-paper" : "text-ink",
                    )}
                    data-cursor="hover"
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -inset-px bg-ink"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">
                      <RollText>{item.label}</RollText>
                    </span>
                  </Link>
                  {isWork ? <WorkMenu pathname={pathname} open={workOpen} /> : null}
                </li>
              );
            })}
          </ul>

          {/* Small screens: the Work sub-navigation sits in the flow as a scrollable row. */}
          {onWork ? (
            <ul className="-mx-4 mt-3 flex gap-5 overflow-x-auto px-4 pb-1 text-[15px] [scrollbar-width:none] md:hidden">
              {categories.map((c) => {
                const href = categoryHref(c.slug);
                const isActive = pathname.startsWith(href);
                return (
                  <li key={c.slug} className="shrink-0">
                    <Link href={href} prefetch className={cn("flex items-center gap-1.5", !isActive && "text-ink/60")}>
                      <span
                        className={cn("size-1.5 rounded-full transition-transform", isActive ? "scale-100" : "scale-0")}
                        style={{ background: accentHex[c.accent] }}
                      />
                      {c.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
