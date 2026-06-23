"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Mock submit — replaced by POST /support in a later phase.
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 700);
  }

  return (
    <main className="pt-32 pb-24">
      <div className="container-x grid gap-12 lg:grid-cols-2">
        {/* Left */}
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            Contact
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mt-4 max-w-md text-muted">
            Questions, partnership ideas, or support — send us a message and
            we&apos;ll get back within one business day.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: "chat", label: "Email", value: "hello@coachbridge.et" },
              { icon: "location", label: "Location", value: "Addis Ababa, Ethiopia" },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-accent">
                  <Icon name={c.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {c.label}
                  </p>
                  <p className="text-fg">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-3xl p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-lime text-ink">
                  <Icon name="check" className="h-8 w-8" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-semibold">
                  Message sent
                </h2>
                <p className="mt-2 text-muted">
                  Thanks for reaching out — we&apos;ll reply soon.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSent(false)}
                >
                  Send another
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={onSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" htmlFor="name">
                    <Input id="name" name="name" required placeholder="Abel T." />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                    />
                  </Field>
                </div>
                <Field label="Subject" htmlFor="subject">
                  <Input id="subject" name="subject" placeholder="How can we help?" />
                </Field>
                <Field label="Message" htmlFor="message">
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us more…"
                  />
                </Field>
                <Button type="submit" fullWidth disabled={submitting}>
                  {submitting ? "Sending…" : "Send message"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
