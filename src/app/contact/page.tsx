import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactHeading } from "@/components/contact/contact-heading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — video editing, motion graphics and colour for films, music videos and social content.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="container-site grid flex-1 items-center gap-12 pb-20 pt-4 md:grid-cols-[minmax(0,1fr)_minmax(0,676px)] md:gap-16 md:pt-10 lg:gap-[120px] lg:pb-28 lg:pt-[70px]">
      <ContactHeading />
      <ContactForm />
    </section>
  );
}
