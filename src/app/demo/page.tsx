import type { Metadata } from "next";
import Script from "next/script";
import { Clock, CheckCircle, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "Book a free 30-minute consultation with Rapid Reports. We'll review one of your processes and show you what's possible.",
};

const whatToExpect = [
  {
    icon: Clock,
    title: "30 minutes",
    description:
      "The call is capped at 30 minutes. We keep it focused and respect your time.",
  },
  {
    icon: MessageSquare,
    title: "Walk through one process",
    description:
      "Have one manual or repetitive process in mind. We'll work through it together and identify what's realistically automatable.",
  },
  {
    icon: CheckCircle,
    title: "Written summary after",
    description:
      "We send a short written summary of what we covered and any recommendations — within 24 hours of the call.",
  },
];

export default function DemoPage() {
  return (
    <div>
      {/* Page hero */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="max-w-2xl">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.6px] text-fg-muted mb-4">
              Book a Demo
            </p>
            <h1
              className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-5"
              style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
            >
              See what&apos;s possible in 30 minutes
            </h1>
            <p className="text-[18px] text-fg-muted leading-relaxed mb-8">
              Pick a time that works for you. We&apos;ll talk through one of your processes and
              give you an honest view of what automation or software could realistically achieve.
            </p>
            <div className="flex flex-wrap gap-3">
              {["30 minutes", "No cost", "No commitment", "Written summary after"].map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-pill border border-border text-sm text-fg-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.24px] mb-8"
            style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)" }}
          >
            What to expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {whatToExpect.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title}>
                  <div className="w-9 h-9 rounded-md bg-fg/[0.06] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-fg-muted" />
                  </div>
                  <p className="font-semibold text-fg mb-2">{item.title}</p>
                  <p className="text-sm text-fg-muted leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Calendly embed */}
          <div className="border border-border rounded-card-lg overflow-hidden">
            <div className="bg-bg-card p-6 border-b border-border">
              <p className="font-semibold text-fg">Pick a time</p>
              <p className="text-sm text-fg-muted mt-1">
                All times shown in your local timezone.
              </p>
            </div>
            {/* Calendly inline widget placeholder */}
            <div
              className="calendly-inline-widget w-full"
              data-url={`${process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/SETUP_REQUIRED"}?hide_event_type_details=1&hide_gdpr_banner=1`}
              style={{ minWidth: "320px", height: "700px" }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
            />
          </div>

          <p className="text-sm text-fg-muted mt-4">
            Having trouble with the calendar? Email us directly at{" "}
            <a
              href="mailto:lidevlin@rapidreports.org"
              className="text-brand hover:underline"
            >
              lidevlin@rapidreports.org
            </a>
          </p>
        </div>
      </section>

      <CtaSection
        headline="Rather send a message?"
        subtext="Use the contact form and we'll get back to you within 24 hours to arrange a time."
        primaryLabel="Send a Message"
        primaryHref="/contact"
      />
    </div>
  );
}
