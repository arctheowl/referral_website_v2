"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactInfo, serviceOptions, contactFaqs, ctaLinks } from "@/data/site-data";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

const empty: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  service: "",
  message: "",
};

const inputClass =
  "w-full px-4 py-3 bg-bg border border-border-md rounded-pill text-fg placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors duration-150 disabled:opacity-50";

const textareaClass =
  "w-full px-4 py-3 bg-bg border border-border-md rounded-card text-fg placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors duration-150 resize-none disabled:opacity-50";

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm(empty);
      } else {
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(24,226,153,0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-brand mb-4">
            Get in Touch
          </p>
          <h1
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-5 max-w-2xl"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            Start with a free consultation
          </h1>
          <p className="text-[18px] text-fg-muted leading-relaxed max-w-xl">
            Tell us about your business and what you&apos;d like to improve. We&apos;ll get back to
            you within 24 hours.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16">

            {/* Form */}
            <div>
              {success ? (
                <Card>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-brand flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-fg mb-2">Message sent</p>
                      <p className="text-sm text-fg-muted leading-relaxed">
                        Thanks for getting in touch. We&apos;ll get back to you within{" "}
                        {contactInfo.responseTime}.
                      </p>
                      <button
                        onClick={() => setSuccess(false)}
                        className="text-sm text-brand hover:underline mt-4 block"
                      >
                        Send another message
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 p-4 rounded-card border border-red-500/20 bg-red-500/5"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-fg-muted">{error}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-fg mb-2">
                        First name <span className="text-brand">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={form.firstName}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Jane"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-fg mb-2">
                        Last name <span className="text-brand">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={form.lastName}
                        onChange={handleChange}
                        disabled={submitting}
                        placeholder="Smith"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-fg mb-2">
                      Email address <span className="text-brand">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="jane@company.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-fg mb-2">
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Your company name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-fg mb-2">
                      What are you interested in?
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      disabled={submitting}
                      className={inputClass}
                    >
                      <option value="">Select an option</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-fg mb-2">
                      Message <span className="text-brand">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      disabled={submitting}
                      placeholder="Tell us about the process you'd like to improve, or ask us anything..."
                      className={textareaClass}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="w-full justify-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
                  Contact Details
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-fg-muted">
                    <span className="font-medium text-fg">Email</span>{" "}
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-brand transition-colors duration-150">
                      {contactInfo.email}
                    </a>
                  </p>
                  <p className="text-sm text-fg-muted">
                    <span className="font-medium text-fg">Phone</span>{" "}
                    <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:text-brand transition-colors duration-150">
                      {contactInfo.phone}
                    </a>
                  </p>
                  <p className="text-sm text-fg-muted">
                    <span className="font-medium text-fg">Location</span>{" "}
                    {contactInfo.primaryLocation}
                  </p>
                  <p className="text-sm text-fg-muted">
                    <span className="font-medium text-fg">Hours</span>{" "}
                    {contactInfo.businessHours}
                  </p>
                  <p className="text-sm text-fg-muted">
                    <span className="font-medium text-fg">Response time</span>{" "}
                    Within {contactInfo.responseTime}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
                  Prefer to Book a Call?
                </p>
                <LinkButton href={ctaLinks.demo} variant="secondary" className="w-full justify-center">
                  Book a Demo
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.24px] mb-8"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}
          >
            Common Questions
          </h2>
          <div className="max-w-2xl space-y-3">
            {contactFaqs.map((faq) => (
              <Card key={faq.question}>
                <p className="font-semibold text-fg mb-2">{faq.question}</p>
                <p className="text-sm text-fg-muted leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
