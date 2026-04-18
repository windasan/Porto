/**
 * components/sections/ContactForm.tsx
 *
 * Client component wrapping the contact form with optimistic state management.
 * Submits to a Server Action (`sendMessage`) defined in the same file.
 *
 * Email delivery: Resend SDK (npm install resend)
 * Swap `sendEmail` with any provider (Postmark, SendGrid, etc.)
 */

"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

// 1. Import fungsi dan tipe dari file action yang baru
import { sendMessage, type FormState } from "@/app/actions/contact";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setState({ status: "idle" });
    
    startTransition(async () => {
      // 2. Panggil fungsi action dari server
      const result = await sendMessage(formData);
      setState(result);

      if (result.status === "success") {
        formRef.current?.reset();
      }
    });
  }

  // ── Field classes ──────────────────────────────────────────────────────
  const fieldClass = [
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm",
    "text-primary placeholder:text-muted",
    "outline-none focus:border-accent focus:ring-1 focus:ring-accent",
    "transition-colors duration-150",
    "disabled:opacity-50",
  ].join(" ");

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
      aria-label="Contact form"
    >
      {/* ── Name ────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-secondary">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Your name"
          disabled={isPending}
          className={fieldClass}
        />
      </div>

      {/* ── Email ───────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-secondary">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          disabled={isPending}
          className={fieldClass}
        />
      </div>

      {/* ── Message ─────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-secondary">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project or just say hello…"
          disabled={isPending}
          className={[fieldClass, "resize-none leading-relaxed"].join(" ")}
        />
      </div>

      {/* ── Error ───────────────────────────────────────────────────── */}
      {state.status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" aria-hidden />
          <p className="text-xs text-red-400">{state.message}</p>
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <Button
        type="submit"
        size="lg"
        loading={isPending}
        className="w-full sm:w-auto"
      >
        <Send size={14} strokeWidth={1.75} aria-hidden />
        {isPending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
