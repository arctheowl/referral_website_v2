import type { Metadata } from "next";
import { ArrowRight, Zap, Code, BarChart3, Brain, Link as LinkIcon, ClipboardCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CtaSection } from "@/components/sections/cta-section";
import { ctaLinks } from "@/data/site-data";

export const metadata: Metadata = {
  title: "IT Consultancy Services",
  description:
    "Process automation, custom software, data analytics, AI/ML, and API development for small and mid-sized businesses. Starting with a free on-site business evaluation.",
};

const services = [
  {
    id: "automation",
    icon: Zap,
    title: "Process Automation",
    description:
      "Remove repetitive admin by connecting systems and automating routine tasks. Stop re-entering the same data across different tools.",
    detail:
      "If your team spends time copying information between spreadsheets, manually sending recurring emails, or running the same report by hand each week — that's automatable. We map the process, select the right tooling, and build a workflow that runs itself.",
    examples: [
      "Auto-send emails when a form is submitted",
      "Move and organise files based on set rules",
      "Generate formatted reports from a data source",
      "Sync records between two or more platforms",
    ],
  },
  {
    id: "software",
    icon: Code,
    title: "Custom Software Development",
    description:
      "When off-the-shelf tools don't fit, we build software around how your team actually works.",
    detail:
      "Generic software forces you to adapt your processes to the tool. We do it the other way: understand how your business operates, then build something that fits exactly. From simple internal tools to full client-facing applications.",
    examples: [
      "Internal management dashboards",
      "Customer or client portals",
      "Quoting and invoicing systems",
      "Database-backed web applications",
    ],
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Data Analytics & Business Intelligence",
    description:
      "Turn disconnected spreadsheets and systems into clear dashboards so decisions are based on facts, not guesswork.",
    detail:
      "Most businesses have more data than they realise — spread across spreadsheets, email, accounting software, and CRMs. We pull it together into a single view that updates automatically, so you always know where things stand.",
    examples: [
      "Live sales and revenue dashboards",
      "Automated weekly or monthly reports",
      "KPI tracking across departments",
      "Data consolidation from multiple sources",
    ],
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI & Machine Learning",
    description:
      "Use AI where it genuinely helps: document handling, smarter forecasting, and support workflow automation.",
    detail:
      "We're honest about what AI can and can't do. Where it adds real value — extracting information from documents, classifying incoming requests, or improving forecast accuracy — we build it in. Where it wouldn't add value, we'll tell you.",
    examples: [
      "Automated document extraction and classification",
      "Intelligent email routing and triage",
      "Demand and stock forecasting",
      "AI-assisted support ticket handling",
    ],
  },
  {
    id: "api",
    icon: LinkIcon,
    title: "API Development & Integration",
    description:
      "Connect your systems so information moves reliably between tools without manual copying or export/import cycles.",
    detail:
      "Most modern software has an API. We build the connections between your tools so data flows automatically — whether that's pulling orders from your e-commerce platform into your accounting software, or syncing a CRM with your email marketing tool.",
    examples: [
      "Connect CRM with email and calendar tools",
      "Sync e-commerce orders with accounting software",
      "Build custom integrations for industry-specific platforms",
      "REST and webhook integrations",
    ],
  },
];

export default function ServicesPage() {
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
            What We Do
          </p>
          <h1
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-5 max-w-3xl"
            style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)" }}
          >
            IT Consultancy Services
          </h1>
          <p className="text-[18px] text-fg-muted leading-relaxed max-w-2xl mb-8">
            Every business runs differently. We start by understanding your current process,
            then recommend practical improvements we can implement quickly and safely.
          </p>
          <LinkButton href={ctaLinks.contact} variant="primary">
            Book Free Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </LinkButton>
        </div>
      </section>

      {/* Featured: Free Evaluation */}
      <section id="evaluation" className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <Card featured>
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-md bg-brand/10 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-brand" />
                </div>
                <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-brand">
                  No Cost · No Commitment
                </span>
              </div>
              <h2 className="font-sans font-semibold text-[24px] leading-snug tracking-[-0.24px] text-fg mb-4">
                Free On-Site Business Evaluation
              </h2>
              <p className="text-fg-muted leading-relaxed max-w-2xl mb-6">
                We visit your workplace, review how your team currently operates, and provide a
                concrete written plan for where we can save you time and money. No cost. No
                obligation to proceed. No hard sell.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "What you get", items: ["On-site process walkthrough", "Written improvement plan", "Honest assessment of priorities"] },
                  { label: "What it costs", items: ["Nothing", "No commitment required", "No follow-up pressure"] },
                  { label: "What happens next", items: ["You receive the plan", "You decide if you want to act", "We quote only if you ask"] },
                ].map((col) => (
                  <div key={col.label}>
                    <p className="font-mono text-[12px] font-medium uppercase tracking-[0.6px] text-fg-muted mb-3">
                      {col.label}
                    </p>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-fg-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <LinkButton href={ctaLinks.contact} variant="brand">
                Book Your Free Evaluation
                <ArrowRight className="ml-2 w-4 h-4" />
              </LinkButton>
            </div>
          </Card>
        </div>
      </section>

      {/* Core services */}
      <section>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className="space-y-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} id={service.id}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-md bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <h2 className="font-sans font-semibold text-[20px] leading-snug tracking-[-0.2px] text-fg">
                        {service.title}
                      </h2>
                      <p className="text-fg-muted mt-1">{service.description}</p>
                    </div>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed mb-5">{service.detail}</p>
                  <div>
                    <p className="font-mono text-[12px] font-medium uppercase tracking-[0.6px] text-fg-muted mb-3">
                      Examples
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.examples.map((ex) => (
                        <li key={ex} className="flex items-start gap-2 text-sm text-fg-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" aria-hidden="true" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection
        headline="Not sure which service fits your problem?"
        subtext="Start with the free on-site evaluation. We'll map your processes and tell you exactly where the opportunities are."
        primaryLabel="Book Free Evaluation"
        primaryHref="/contact"
        secondaryLabel="See Pricing"
        secondaryHref="/pricing"
      />
    </div>
  );
}
