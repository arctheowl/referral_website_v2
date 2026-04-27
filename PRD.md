# PRD — Rapid Reports Website v3

## Problem Statement

The existing v2 website uses a dark navy/gold design that doesn't match the intended brand direction. The firm has no clients yet, so social proof sections are empty and credibility-damaging. The site needs a complete redesign using the Mintlify-inspired design system defined in `DESIGN.md`, with a tighter page structure that removes noise and focuses every page on converting a cautious, non-technical business owner into a booked consultation.

## Solution

A fresh Next.js + Tailwind website built dark-mode-first per `DESIGN.md`, with six focused pages. Content is carried over from v2 with updated copy where needed. The free on-site business evaluation remains the primary conversion point throughout. A new Demo page handles the "book a call" use case via a Calendly embed.

## Site Structure

```
Home · Services · Pricing · About · Demo · Contact
```

Pages **removed** from v2: Blog, Portfolio, individual service sub-pages (`/services/automation`, etc.)

## User Stories

1. As a business owner who lands on the homepage, I want to immediately understand what Rapid Reports does and who it is for, so that I can decide within 10 seconds whether to read further.
2. As a visitor, I want to see a clear primary CTA above the fold, so that I know exactly what my next step is without scrolling.
3. As a cautious buyer, I want to see a "free, no commitment" offer prominently in the hero, so that I feel safe engaging before I spend any money.
4. As a mobile user, I want the navigation to collapse to a hamburger menu, so that I can navigate the site comfortably on my phone.
5. As a visitor browsing services, I want all five services explained on a single page, so that I can compare them without clicking back and forth.
6. As a prospect interested in automation, I want to see specific prices and clear tier descriptions, so that I can self-qualify before getting in touch.
7. As a visitor on the Pricing page, I want to see a step-by-step "How It Works" process, so that I know what happens after I get in touch.
8. As a visitor on the Pricing page, I want to see a list of add-ons with prices, so that I understand the full cost picture.
9. As a visitor reading the Pricing FAQ, I want honest answers to common concerns (software costs, change requests, turnaround time), so that I feel confident there are no hidden gotchas.
10. As a prospect ready to book, I want a dedicated Demo page with a Calendly embed, so that I can pick a time without leaving the site or sending an email and waiting.
11. As a visitor on the Demo page, I want context about what the call involves (length, agenda, what to expect), so that I feel prepared rather than ambushed.
12. As a prospect with a specific question, I want a contact form with a service-interest dropdown, so that my enquiry is routed clearly from the start.
13. As a visitor who submits the contact form, I want a confirmation message on screen, so that I know my message was received without refreshing the page.
14. As a visitor who submits the contact form, I want a welcome email in my inbox, so that I have a record of my enquiry.
15. As the site owner, I want form submissions to create a contact record in Resend, so that I can follow up and track leads over time.
16. As a visitor learning about the firm, I want an About page that explains why Rapid Reports exists and what its approach is, so that I understand the firm's personality before trusting it with my business processes.
17. As a visitor who prefers dark interfaces, I want the site to render in dark mode by default, so that I don't get a jarring white flash when the page loads.
18. As a visitor who prefers light mode, I want the site to switch to the light colour scheme automatically based on my system preference, so that the site respects my OS settings.
19. As a visitor using a screen reader, I want all interactive elements to have accessible labels and focus states, so that I can navigate without a mouse.
20. As a visitor with reduced motion enabled, I want hover transitions to be suppressed, so that the site respects my accessibility preference.
21. As a visitor on any page, I want a consistent footer with contact details and navigation links, so that I can find what I need without scrolling back to the top.
22. As a site owner, I want all company details (email, phone, address, CTA links) stored in a single `site-data.ts` file, so that I can update them once and have them reflected everywhere.

## Implementation Decisions

### Stack
- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS with design tokens from `DESIGN.md` extended into `tailwind.config.ts`
- **Email:** Resend (carried from v2) — contact form notification to owner + welcome email to visitor
- **Booking:** Calendly embed (iframe) on the Demo page
- **No animation library** — CSS hover transitions only; no Framer Motion

### Design
- Dark mode is the **primary** render target; light mode is the `prefers-color-scheme: light` override
- All colour tokens, typography scale, border-radius values, and shadow definitions from `DESIGN.md` implemented as Tailwind config extensions and/or CSS custom properties
- Fonts: Inter (all body/UI copy) + Geist Mono (technical labels only), loaded via `next/font`
- No Trust Bar / logo grid section — removed until real clients exist

### Pages & Modules

| Page | Key sections |
|---|---|
| Home (`/`) | Nav · Hero (atmospheric gradient, dual CTA) · Services overview · Pricing teaser · About teaser · Final CTA · Footer |
| Services (`/services`) | Page hero · All 5 services with icons and descriptions · Featured: Free On-Site Evaluation · Bottom CTA |
| Pricing (`/pricing`) | Page hero · How It Works (5 steps) · 4-tier rate card · Add-ons table · FAQ · Bottom CTA |
| About (`/about`) | Page hero · Company story · Why we exist · Our approach · Values · Bottom CTA |
| Demo (`/demo`) | Page hero · What to expect (call length, agenda) · Calendly embed · Footer CTA |
| Contact (`/contact`) | Page hero · Contact form (first name, last name, email, company, service interest, message) · Inline success/error states · FAQ · Bottom CTA |

### Centralized Data
- `src/data/site-data.ts` — company info, contact details, navigation, service options, FAQ, CTA links, SEO metadata
- All pages import from this single file; no hardcoded strings in components

### API Routes
- `POST /api/contact` — validates form, creates Resend contact, sends notification to owner, sends welcome email to visitor

### Pre-deployment Configuration
- All environment variables and third-party setup steps documented in `SETUP.md`

## Testing Decisions

### What makes a good test
Test external behaviour, not implementation details. A good test asserts what a user or API caller observes — not which internal function was called or how state is structured internally.

### Modules to test
- **`/api/contact` route** — validation logic (missing fields, bad email format), success response shape, error response shape. These are pure input/output with no UI surface, making them ideal unit/integration tests.
- **`site-data.ts`** — shape tests asserting that required fields (email, phone, navigation items) are present and non-empty, so a bad edit doesn't silently break the whole site.
- **UI primitives (Button, Card, Badge)** — snapshot or behaviour tests confirming variant classes are applied correctly, accessible roles are present, and click handlers fire.

### Prior art
V2's contact API route (`src/app/api/contact/route.ts`) is the closest prior art for testing the form submission flow.

## Out of Scope

- Blog — no content exists; add when ready
- Portfolio / case studies — no clients yet; add when real work can be shown
- Individual service sub-pages (`/services/automation`, etc.) — consolidated into `/services`
- Trust bar / client logo grid — no clients yet
- Newsletter / mailing list sign-up — contact form only
- Dark/light mode manual toggle in the UI — system preference only (`prefers-color-scheme`)
- CMS integration — all content is static in `site-data.ts` for now
- Internationalisation

## Further Notes

- The Pricing page content (tier names, prices, included items, add-ons, FAQs) carries over from v2 verbatim — do not rewrite without the owner reviewing first, as prices are real.
- The "Free On-Site Business Evaluation" is the firm's primary lead-generation offer and must be prominent on both the homepage and the Services page.
- All prices are in GBP and include VAT. This must be stated on the Pricing page.
- The About page must not include placeholder team members — company story only, to be written from scratch.
- The Demo page Calendly URL is a pre-deployment configuration item (see `SETUP.md`).
- Respect `prefers-reduced-motion` on all CSS transitions.
- WCAG AA colour contrast must be verified for both dark and light mode.
