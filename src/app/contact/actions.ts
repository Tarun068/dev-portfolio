"use server";

export type ContactField = "name" | "email" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: Record<ContactField, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sends the contact form through Resend's HTTP API when RESEND_API_KEY and
 * CONTACT_TO_EMAIL are set (see .env.example). In development without them,
 * the message is logged so the form can still be exercised.
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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email delivery is not configured. Message received:", values);
      return { status: "success" };
    }
    return { status: "error", message: "The contact form isn’t connected yet. Please try again later.", values };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: values.email,
      subject: `New message from ${values.name}`,
      text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text().catch(() => ""));
    return { status: "error", message: "Something went wrong sending your message. Please try again.", values };
  }

  return { status: "success" };
}
