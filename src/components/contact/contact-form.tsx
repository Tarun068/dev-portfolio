"use client";

import { AnimatePresence, motion } from "motion/react";
import { useActionState, useLayoutEffect, useState } from "react";
import { sendMessage, type ContactField, type ContactState } from "@/app/contact/actions";
import { FillButton } from "@/components/ui/fill-button";
import { cn, easeOutExpo } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };
const burst = ["bg-sun", "bg-flame", "bg-sky", "bg-leaf"];

function Field({
  name,
  label,
  error,
  defaultValue,
  multiline,
  type = "text",
  autoComplete,
}: {
  name: ContactField;
  label: string;
  error?: string;
  defaultValue?: string;
  multiline?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    required: true,
    defaultValue,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: cn(
      "block w-full border bg-transparent px-4 text-[18px] outline-none lg:text-[21px] transition-colors duration-300",
      error ? "border-flame" : "border-ink",
    ),
  };

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[18px] lg:text-[21px]">
        {label} <span className="text-[14px] text-caption lg:text-[15px]">(Required)</span>
      </label>
      <div className="group relative">
        {multiline ? (
          <textarea {...shared} rows={5} maxLength={5000} data-lenis-prevent className={cn(shared.className, "h-[145px] resize-none py-3")} />
        ) : (
          <input {...shared} type={type} className={cn(shared.className, "h-[54px]")} />
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-leaf transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within:scale-x-100"
        />
      </div>
      <AnimatePresence>
        {error ? (
          <motion.p
            id={`${id}-error`}
            className="mt-1.5 text-[14px] text-flame"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Form({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendMessage, initialState);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <motion.div
          key="sent"
          role="status"
          className="flex min-h-[420px] flex-col items-start justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <div className="relative mb-6 flex gap-3">
            {burst.map((c, i) => (
              <motion.span
                key={c}
                className={cn("size-4 rounded-full", c)}
                initial={{ scale: 0, y: 0 }}
                animate={{ scale: [0, 1.4, 1], y: [0, -40, 0] }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: easeOutExpo }}
              />
            ))}
          </div>
          <p className="text-[40px] font-semibold leading-none lg:text-[48px]">Thank you!</p>
          <p className="mt-4 max-w-[420px] text-[18px] lg:text-[21px]">
            Your message is on its way. I’ll get back to you soon.
          </p>
          <button type="button" onClick={onReset} className="mt-8 text-[18px] underline underline-offset-4">
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          noValidate
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          <Field name="name" label="Name" autoComplete="name" error={state.errors?.name} defaultValue={state.values?.name} />
          <Field
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={state.errors?.email}
            defaultValue={state.values?.email}
          />
          <Field name="message" label="Message" multiline error={state.errors?.message} defaultValue={state.values?.message} />

          {/* Honeypot for bots */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <FillButton type="submit" disabled={pending}>
              {pending ? "Sending…" : "Send"}
            </FillButton>
            {state.message ? (
              <p role="alert" className="text-[15px] text-flame">
                {state.message}
              </p>
            ) : null}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/** Contact form (PDF page 12). Remounting via `key` starts a fresh form. */
export function ContactForm() {
  const [formKey, setFormKey] = useState(0);
  // Start fresh when the page is hidden by Activity, so a stale "Thank you" doesn't linger.
  useLayoutEffect(() => () => setFormKey((k) => k + 1), []);
  return <Form key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}
