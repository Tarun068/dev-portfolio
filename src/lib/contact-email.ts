import type { SendMailOptions } from "nodemailer";

export type ContactMessage = { name: string; email: string; message: string };

/**
 * The email Dev receives for a contact form message. It is sent from the site's Gmail account
 * (Gmail only sends as the signed-in address) with the visitor's name shown as the sender, and
 * Reply-To set to the visitor, so pressing Reply answers them directly.
 */
export function contactEmail(msg: ContactMessage, sender: string, to: string): SendMailOptions {
  // A crafted request could put line breaks in the name; keep it on one line for the headers.
  const name = msg.name.replace(/[\r\n]+/g, " ");
  return {
    from: { name: `${name} via Portfolio`, address: sender },
    to,
    replyTo: { name, address: msg.email },
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${msg.email}\n\n${msg.message}`,
  };
}
