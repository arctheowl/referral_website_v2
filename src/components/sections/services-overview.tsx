import Link from "next/link";
import { ArrowRight, Zap, Code, BarChart3, Brain, Link as LinkIcon, ClipboardCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { ctaLinks } from "@/data/site-data";

const iconMap = {
  ClipboardCheck,
  Zap,
  Code,
  BarChart3,
  Brain,
  Link: LinkIcon,
};

const coreServices = [
  { id: "automation", icon: "Zap" as const, title: "Process Automation", description: "Remove repetitive admin by connecting systems and automating routine tasks." },
  { id: "software", icon: "Code" as const, title: "Custom Software Development", description: "When off-the-shelf tools don't fit, we build software around how your team actually works." },
  { id: "analytics", icon: "BarChart3" as const, title: "Data Analytics & BI", description: "Turn disconnected data into clear dashboards so decisions are based on facts, not guesswork." },
  { id: "ai", icon: "Brain" as const, title: "AI & Machine Learning", description: "Use AI where it genuinely helps: document handling, smarter forecasting, support workflows." },
  { id: "api", icon: "Link" as const, title: "API Development", description: "Connect your systems so information moves reliably between tools without manual copying." },
];

export function ServicesOverview() {
  return (
    <section className="border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-24">

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
            What We Do
          </p>
          <h2
            className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-4"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            Our IT Consultancy Services
          </h2>
          <p className="text-[18px] text-fg-muted leading-relaxed">
            Every business runs differently. We start by understanding your current process,
            then recommend practical improvements we can implement quickly and safely.
          </p>
        </div>

        {/* Featured: Free Evaluation */}
        <Link href="/services#evaluation" className="group block mb-6">
          <div className="bg-bg-card rounded-card-lg border border-border p-8 lg:p-10 hover:border-border-md transition-colors duration-150">
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-md bg-brand/10 flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5 text-brand" />
                  </div>
                  <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-brand">
                    No Cost · No Commitment
                  </span>
                </div>
                <h3 className="font-sans font-semibold text-[20px] leading-snug tracking-[-0.2px] text-fg mb-3">
                  Free On-Site Business Evaluation
                </h3>
                <p className="text-fg-muted leading-relaxed max-w-2xl mb-4">
                  We visit your workplace, review how your team currently operates, and provide a concrete plan for
                  where we can save you time and money — at no cost.
                </p>
                <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
                  {["On-site process walkthrough", "Concrete improvement recommendations", "No-obligation written summary"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-fg-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 bg-brand text-near-black text-sm font-semibold px-5 py-3 rounded-pill group-hover:gap-3 transition-all duration-150">
                  Book Free Visit
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Core services list */}
        <div className="border-t border-border">
          {coreServices.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group flex items-center gap-5 py-5 border-b border-border hover:bg-bg-card/50 px-3 -mx-3 rounded-md transition-colors duration-150"
              >
                <div className="w-9 h-9 rounded-md bg-brand/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-fg group-hover:text-brand transition-colors duration-150 leading-snug">
                    {service.title}
                  </p>
                  <p className="text-sm text-fg-muted mt-0.5 line-clamp-1">{service.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-border-md group-hover:text-brand group-hover:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-fg mb-1">Not sure where to start?</p>
            <p className="text-sm text-fg-muted">
              We will visit your site and show you exactly what is possible.
            </p>
          </div>
          <LinkButton href={ctaLinks.contact} variant="primary" className="flex-shrink-0">
            Get Free Consultation
            <ArrowRight className="ml-2 w-4 h-4" />
          </LinkButton>
        </div>

      </div>
    </section>
  );
}
