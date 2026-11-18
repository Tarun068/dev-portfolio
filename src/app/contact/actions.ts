"use server";

import nodemailer, { type Transporter } from "nodemailer";
import { contactEmail } from "@/lib/contact-email";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Record<ContactField, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let mailer: Transporter | null = null;

/** One SMTP connection setup per server, reused for every message. Defaults to Gmail. */
function getMailer(user: string, pass: string) {
  if (!mailer) {
    const port = Number(process.env.SMTP_PORT || 465);
    mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port,
      secure: port === 465, // 465 = TLS from the start; 587 upgrades with STARTTLS
      auth: { user, pass },
      // Fail fast so the visitor isn't left waiting if the mail server can't be reached.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return mailer;
}

/**
 * Emails the contact form to Dev through Gmail's SMTP server when SMTP_USER and SMTP_PASS
 * (a Google App Password) are set (see .env.example). In development without them, the
 * message is logged so the form can still be exercised.
 */
export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  // Honeypot: real people never fill the hidden "company" field.
  if (String(formData.get("company") ?? "") !== "") return { status: "success" };

  const errors: ContactState["errors"] = {};
  if (!values.name) errors.name = "Please tell me your name.";
  else if (values.name.length > 120) errors.name = "That name is a bit long.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Please enter a valid email address.";
  if (values.message.length < 2) errors.message = "Don’t forget your message.";
  else if (values.message.length > 5000) errors.message = "Please keep it under 5000 characters.";
  if (Object.keys(errors).length > 0) return { status: "error", errors, values };

  const user = process.env.SMTP_USER?.trim();
  // Google shows App Passwords in groups of four ("abcd efgh ijkl mnop"); the spaces aren't part of it.
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const to = process.env.CONTACT_TO_EMAIL?.trim() || user;

  if (!user || !pass || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email delivery is not configured. Message received:", values);
      return { status: "success" };
    }
    return { status: "error", message: "The contact form isn’t connected yet. Please try again later.", values };
  }

  try {
    await getMailer(user, pass).sendMail(contactEmail(values, user, to));
  } catch (error) {
    console.error("[contact] Could not send the message:", error);
    return { status: "error", message: "Something went wrong sending your message. Please try again.", values };
  }

  return { status: "success" };
}
