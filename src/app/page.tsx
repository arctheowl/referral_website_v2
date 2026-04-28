import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <CtaSection
        headline="Find out where your business is losing time."
        subtext="Book a free consultation — no obligation. We'll show you exactly where the opportunities are."
        primaryLabel="Book Free Consultation"
        primaryHref="/contact"
        secondaryLabel="See Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
