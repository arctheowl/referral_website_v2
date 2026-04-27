import { Hero } from "@/components/sections/hero";
import { ServicesOverview } from "@/components/sections/services-overview";
import { CtaSection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <CtaSection
        headline="Ready to stop doing things the hard way?"
        subtext="Book a free, no-obligation consultation and we'll show you exactly where your business can save time."
        primaryLabel="Book Free Consultation"
        primaryHref="/contact"
        secondaryLabel="See Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
