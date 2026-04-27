"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation, companyInfo } from "@/data/site-data";
import { LinkButton } from "@/components/ui/button";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-sans font-semibold text-[17px] tracking-tight text-fg hover:text-brand transition-colors duration-150"
        >
          {companyInfo.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-[15px] font-medium transition-colors duration-150 rounded-md relative
                ${isActive(item.href)
                  ? "text-fg"
                  : "text-fg-muted hover:text-fg"
                }`}
            >
              {item.name}
              {isActive(item.href) && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-px bg-brand rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <LinkButton href={navigation.cta.href} variant="primary" size="sm">
            {navigation.cta.name}
          </LinkButton>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-fg-muted hover:text-fg transition-colors duration-150"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg px-6 py-4 space-y-0.5">
          {navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 text-[15px] font-medium rounded-md transition-colors duration-150
                ${isActive(item.href) ? "text-fg" : "text-fg-muted hover:text-fg"}`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-3">
            <LinkButton
              href={navigation.cta.href}
              variant="primary"
              className="w-full justify-center"
            >
              {navigation.cta.name}
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
