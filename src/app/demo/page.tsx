import type { Metadata } from "next";
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
      "The call is capped at 30 minutes. We respect your time and keep it focused.",
  },
  {
    icon: MessageSquare,
    title: "Talk through one process",
    description:
      "Come with one manual or repetitive process in mind. We'll walk through it together and identify practical improvements.",
  },
  {
    icon: CheckCircle,
    title: "Written summary sent after",
    description:
      "We send a short written summary of what we discussed and any recommendations within 24 hours.",
  },
];

export default function DemoPage() {
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
            Book a Demo
          </p>
          <h1
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-5 max-w-3xl"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            See what&apos;s possible in 30 minutes
          </h1>
          <p className="text-[18px] text-fg-muted leading-relaxed max-w-2xl">
            Pick a time that works for you. We&apos;ll talk through one of your processes and
            give you an honest view of what automation or software could realistically achieve.
            No cost. No commitment. No hard sell.
          </p>
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
                  <div className="w-9 h-9 rounded-md bg-brand/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand" />
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
              data-url={`${process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/SETUP_REQUIRED"}?hide_landing_page_details=1&hide_gdpr_banner=1`}
              style={{ minWidth: "320px", height: "700px" }}
            />
            <script
              type="text/javascript"
              src="https://assets.calendly.com/assets/external/widget.js"
              async
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
        headline="Prefer to send a message first?"
        subtext="Use the contact form and we'll get back to you within 24 hours to arrange a convenient time."
        primaryLabel="Send a Message"
        primaryHref="/contact"
      />
    </div>
  );
}
