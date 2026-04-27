import type { Metadata } from "next";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { CtaSection } from "@/components/sections/cta-section";
import { serviceTiers, addOns, howItWorks, pricingFaqs, ctaLinks } from "@/data/site-data";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Clear, fixed-price automation services. Free consultation, four service tiers from £450, optional add-ons, and post-delivery support included.",
};

export default function PricingPage() {
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
            Pricing
          </p>
          <h1
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-5 max-w-3xl"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            Process Automation Pricing
          </h1>
          <p className="text-[18px] text-fg-muted leading-relaxed max-w-2xl mb-8">
            Clear, fixed-price automation services tailored to your process complexity — from quick
            workflow wins to end-to-end systems automation.
          </p>
          <LinkButton href={ctaLinks.contact} variant="primary">
            Book Free Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </LinkButton>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-10"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {howItWorks.map((step, i) => (
              <div key={step.title} className="relative">
                <Card>
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                    <span className="font-mono text-[12px] font-semibold text-brand">{i + 1}</span>
                  </div>
                  <p className="font-semibold text-fg mb-2">{step.title}</p>
                  <p className="text-sm text-fg-muted leading-relaxed">{step.description}</p>
                </Card>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-fg-muted" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-10"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Service Tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {serviceTiers.map((tier) => (
              <Card key={tier.label} className="flex flex-col">
                <div className="mb-5">
                  <p className="font-sans font-semibold text-[20px] tracking-[-0.2px] text-fg mb-1">
                    {tier.label}
                  </p>
                  <p className="text-brand font-semibold text-[18px]">{tier.price}</p>
                  {tier.priceNote && (
                    <p className="text-sm text-fg-muted">{tier.priceNote}</p>
                  )}
                </div>
                <p className="text-sm text-fg-muted leading-relaxed mb-5">
                  <span className="font-medium text-fg">Best for: </span>
                  {tier.bestFor}
                </p>

                <div className="mb-5">
                  <p className="font-mono text-[12px] font-medium uppercase tracking-[0.6px] text-fg-muted mb-3">
                    Examples
                  </p>
                  <ul className="space-y-2">
                    {tier.examples.map((ex) => (
                      <li key={ex} className="flex items-start gap-2 text-sm text-fg-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand/60 mt-1.5 flex-shrink-0" aria-hidden="true" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <p className="font-mono text-[12px] font-medium uppercase tracking-[0.6px] text-fg-muted mb-3">
                    What&apos;s Included
                  </p>
                  <ul className="space-y-2">
                    {tier.included.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-fg-muted">
                        <CheckCircle className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-8"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Add-Ons
          </h2>
          <div className="max-w-2xl">
            <Card className="p-0 overflow-hidden">
              <div className="grid grid-cols-2 border-b border-border px-6 py-3">
                <span className="text-sm font-medium text-fg">Add-On</span>
                <span className="text-sm font-medium text-fg">Price</span>
              </div>
              {addOns.map((addon, i) => (
                <div
                  key={addon.name}
                  className={`grid grid-cols-2 px-6 py-4 ${i < addOns.length - 1 ? "border-b border-border" : ""}`}
                >
                  <span className="text-sm text-fg-muted">{addon.name}</span>
                  <span className="text-sm text-fg-muted font-medium">{addon.price}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-8"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl space-y-3">
            {pricingFaqs.map((faq) => (
              <Card key={faq.question}>
                <p className="font-semibold text-fg mb-2">{faq.question}</p>
                <p className="text-sm text-fg-muted leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
          <p className="text-sm text-fg-muted mt-6">
            All prices are in GBP and include VAT. Fixed-price quotes are provided after the free consultation.
          </p>
        </div>
      </section>

      <CtaSection
        headline="Ready to start?"
        subtext="Book your free consultation today. No cost, no obligation."
        primaryLabel="Book Free Consultation"
        primaryHref={ctaLinks.contact}
      />
    </div>
  );
}
