import { ArrowRight, ClipboardCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { ctaLinks } from "@/data/site-data";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">

          {/* Left: headline + CTAs */}
          <div>
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.6px] text-fg-muted mb-5">
              IT Consultancy · Andover, Hampshire
            </p>

            <h1
              className="font-sans font-semibold text-fg leading-[1.15] tracking-[-1.28px] mb-6"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              Practical IT
              <br />
              for Growing
              <br />
              <span className="text-brand">Businesses</span>
            </h1>

            <p className="text-[18px] text-fg-muted leading-relaxed max-w-lg mb-10">
              We help small businesses spend less time on manual, repetitive
              work. We review how your team operates, then build practical
              automations and tools that save real hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <LinkButton href={ctaLinks.contact} variant="primary" size="lg">
                Book Free Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </LinkButton>
              {/* <LinkButton href={ctaLinks.evaluation} variant="secondary" size="lg">
                Free On-Site Evaluation
              </LinkButton> */}
            </div>
          </div>

          {/* Right: evaluation offer card */}
          <div className="hidden lg:block">
            <div className="relative bg-bg-card rounded-card-lg border border-border overflow-hidden shadow-[var(--shadow-card)]">
              {/* Brand accent bar — kept here because it marks the featured offer */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand" />
              <div className="p-8">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-brand mb-4">
                  No Cost · No Commitment
                </p>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-md bg-fg/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ClipboardCheck className="w-4 h-4 text-fg-muted" />
                  </div>
                  <h2 className="font-sans font-semibold text-[19px] leading-snug tracking-[-0.2px] text-fg">
                    Free On-Site Business Evaluation
                  </h2>
                </div>
                <p className="text-sm text-fg-muted leading-relaxed mb-6">
                  We visit your workplace, review how your team currently works,
                  and give you a written plan showing where time and money can
                  be saved.
                </p>
                <ul className="space-y-2.5 mb-7">
                  {[
                    "On-site process walkthrough",
                    "Written improvement plan",
                    "No hard sell, ever",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-fg-muted">
                      <span className="w-1 h-1 rounded-full bg-fg-muted/40 flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <LinkButton href={ctaLinks.contact} variant="brand" className="w-full justify-center">
                  Book Your Visit
                  <ArrowRight className="ml-2 w-4 h-4" />
                </LinkButton>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
