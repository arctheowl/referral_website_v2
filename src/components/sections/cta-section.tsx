import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

interface CtaSectionProps {
  headline: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CtaSection({
  headline,
  subtext,
  primaryLabel = "Book Free Consultation",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: CtaSectionProps) {
  return (
    <section className="border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center">
        <h2
          className="font-sans font-semibold text-fg leading-[1.10] tracking-[-0.8px] mb-5 mx-auto max-w-2xl"
          style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
        >
          {headline}
        </h2>
        {subtext && (
          <p className="text-[18px] text-fg-muted leading-relaxed mb-10 max-w-xl mx-auto">
            {subtext}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <LinkButton href={primaryHref} variant="primary" size="lg">
            {primaryLabel}
            <ArrowRight className="ml-2 w-4 h-4" />
          </LinkButton>
          {secondaryLabel && secondaryHref && (
            <LinkButton href={secondaryHref} variant="secondary" size="lg">
              {secondaryLabel}
            </LinkButton>
          )}
        </div>
      </div>
    </section>
  );
}
