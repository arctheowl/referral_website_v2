import Link from "next/link";
import { companyInfo, contactInfo, footerLinks } from "@/data/site-data";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-sans font-semibold text-[17px] text-fg mb-3">
              {companyInfo.name}
            </p>
            <p className="text-sm text-fg-muted leading-relaxed mb-4">
              {companyInfo.description}
            </p>
            <p className="text-sm text-fg-muted">{contactInfo.primaryLocation}</p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-sm text-fg-muted hover:text-brand transition-colors duration-150 block mt-1"
            >
              {contactInfo.email}
            </a>
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="text-sm text-fg-muted hover:text-brand transition-colors duration-150 block mt-1"
            >
              {contactInfo.phone}
            </a>
          </div>

          {/* Company */}
          <div>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
              Company
            </p>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-fg transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
              Services
            </p>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-fg transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.6px] text-fg-muted mb-4">
              Get Started
            </p>
            <ul className="space-y-2">
              {footerLinks.getStarted.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-fg transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-fg-muted">
            &copy; {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
          </p>
          <p className="text-sm text-fg-muted">{contactInfo.primaryLocation}</p>
        </div>
      </div>
    </footer>
  );
}
