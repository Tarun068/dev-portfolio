import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHeading } from "@/components/contact/contact-heading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — video editing, motion graphics and colour for films, music videos and social content.`,
  alternates: { canonical: "/contact" },
};

/**
 * PDF page 12. Side by side on wide screens: the form column is exactly as wide as the main
 * navigation (650px with its border), so the form lines up under it, and the heading fills the
 * rest, right-aligned. Smaller screens stack the two in a centred column of the same width.
 * Either way the content sits centred between the header and the bottom of the screen.
 */
export default function ContactPage() {
  return (
    <section className="container-site page-pt page-pb grid flex-1 content-center items-center gap-12 md:gap-16 xl:grid-cols-[minmax(0,1fr)_650px] xl:gap-x-[116px]">
      <div className="mx-auto w-full max-w-[650px] [container-type:inline-size] xl:max-w-none">
        <ContactHeading />
      </div>
      <div className="mx-auto w-full max-w-[650px] xl:max-w-none">
        <ContactForm />
      </div>
    </section>
  );
}
