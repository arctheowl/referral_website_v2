import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { CtaSection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rapid Reports is an IT consultancy based in Andover, Hampshire. We help small and mid-sized businesses reduce manual work through practical technology solutions.",
};

const values = [
  {
    title: "Lead with the problem, not the technology",
    description:
      "The client's pain is manual drudgery. We name it before naming the solution. Abstract words like 'digital transformation' mean nothing to an office manager; 'your team spending three hours re-entering the same data' does.",
  },
  {
    title: "Expert confidence without jargon",
    description:
      "We speak in business outcomes — time saved, errors eliminated, staff freed up — rather than stack choices or technical capabilities. Our clients are not technical, and they shouldn't need to be.",
  },
  {
    title: "Concrete over abstract",
    description:
      "Every claim is grounded. Specific services, specific outcomes, specific steps. Vague aspiration erodes trust with business owners who've heard vendor promises before.",
  },
  {
    title: "Earned trust over performed modernity",
    description:
      "Trust signals matter more than visual novelty. Clear services, a transparent process, a real location, and direct contact matter more than trend-chasing. We're a firm that has done this before.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Page hero */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="max-w-3xl">
            <h1
              className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
            >
              About Rapid Reports
            </h1>
            <p className="text-[20px] text-fg-muted leading-relaxed max-w-2xl">
              An IT consultancy based in Andover, Hampshire. We help small and mid-sized business
              owners reduce the time their teams spend on manual, repetitive work.
            </p>
          </div>
        </div>
      </section>

      {/* Why we exist */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
                Why We Exist
              </p>
              <h2
                className="font-sans font-semibold text-fg leading-[1.15] tracking-[-0.24px] mb-5"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.75rem)" }}
              >
                Most businesses have never invested in bespoke software. Not because they don't need it, but because they don't know where to start.
              </h2>
              <p className="text-fg-muted leading-relaxed mb-4">
                We work with business owners and office managers who watch their teams spend hours on manual,
                repetitive processes: spreadsheets copied row by row, paper forms re-keyed into systems,
                multi-step tasks that exist only because no one has built a better way.
              </p>
              <p className="text-fg-muted leading-relaxed">
                Rapid Reports exists to be the firm that fixes that. Not with grand promises about digital
                transformation, but with practical tools and automations that save real hours and reduce
                real errors — delivered by people you can actually talk to.
              </p>
            </div>
            <div>
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
                Our Approach
              </p>
              <div className="space-y-4">
                {[
                  { step: "01", title: "Start with a free evaluation", description: "We visit your workplace and map your current processes before recommending anything. No cost, no obligation." },
                  { step: "02", title: "Scope a fixed-price solution", description: "We propose a specific scope of work with a fixed price. No day-rate ambiguity, no surprise invoices." },
                  { step: "03", title: "Build, test, hand over", description: "We build the solution against your real data, test it thoroughly, and hand it over with documentation your team can use." },
                  { step: "04", title: "Stay on hand", description: "Every project comes with a post-delivery support window. We don't disappear after the handover." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="font-mono text-[12px] font-semibold text-fg-muted/40 mt-0.5 flex-shrink-0 w-6 select-none">
                      {item.step}
                    </span>
                    <div>
                      <p className="font-medium text-fg mb-1">{item.title}</p>
                      <p className="text-sm text-fg-muted leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-2xl mb-10">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
              How We Work
            </p>
            <h2
              className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px]"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
            >
              Our Design Principles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value) => (
              <Card key={value.title}>
                <h3 className="font-sans font-semibold text-[16px] text-fg mb-3">{value.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-xl">
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
              Where We Are
            </p>
            <h2 className="font-sans font-semibold text-[20px] tracking-[-0.2px] text-fg mb-4">
              Based in Andover, Hampshire
            </h2>
            <p className="text-fg-muted leading-relaxed mb-4">
              We're a local consultancy. For clients in Hampshire and the surrounding area,
              we offer on-site visits as part of our evaluation process. For clients further afield,
              we work remotely — consultations by video call, delivery via whatever collaboration
              tools you already use.
            </p>
            <p className="text-sm text-fg-muted">
              Monday – Friday · 9 AM – 6 PM GMT &middot; Response within 24 hours
            </p>
          </div>
        </div>
      </section>

      <CtaSection
        headline="Ready to work with us?"
        subtext="Start with a free, no-commitment on-site evaluation. We'll visit, map your processes, and give you a written plan."
        primaryLabel="Book Free Evaluation"
        primaryHref="/contact"
        secondaryLabel="View Services"
        secondaryHref="/services"
      />
    </div>
  );
}
