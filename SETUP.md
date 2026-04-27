# Pre-Deployment Setup Checklist

Complete each step before deploying the site. All environment variables go in `.env.local`
(copy `.env.example` → `.env.local` and fill in the values).

---

## 1. Domain & Hosting

- [ ] Register your domain (e.g. `rapidreports.co.uk`) if not already done.
- [ ] Connect the domain to your hosting provider (Vercel recommended — see below).
- [ ] Update `seoDefaults.url` in `src/data/site-data.ts` to your live domain.

---

## 2. Resend (Email)

The contact form sends emails via Resend. Required for the form to work in production.

1. Create a free account at [resend.com](https://resend.com)
2. Go to **API Keys** → Create a new key → Copy it into `.env.local` as `RESEND_API_KEY`
3. Go to **Domains** → Add your domain (e.g. `rapidreports.co.uk`) → Follow the DNS verification steps
4. Once verified, update `RESEND_FROM_EMAIL` to something like:
   ```
   RESEND_FROM_EMAIL=Rapid Reports <hello@rapidreports.co.uk>
   ```
5. Set `CONTACT_EMAIL` to the inbox where you want to receive enquiries:
   ```
   CONTACT_EMAIL=lidevlin@rapidreports.org
   ```
6. **Optional — Resend Audiences (lead tracking)**:
   - Go to **Audiences** → Create a new audience → Copy the ID
   - Set `RESEND_AUDIENCE_ID=<your-audience-id>` in `.env.local`
   - Contact form submissions will automatically create/update contact records

> **Development note**: Without `RESEND_API_KEY` set, emails are silently skipped and the form
> still returns a success response. Safe for local development.

---

## 3. Calendly (Demo Page)

The `/demo` page embeds a Calendly booking calendar.

1. Create a free account at [calendly.com](https://calendly.com)
2. Set up an event type:
   - Recommended: **30-minute consultation**
   - Add a description explaining what the call covers (see the demo page copy for inspiration)
3. Copy your booking page URL (e.g. `https://calendly.com/your-username/30min`)
4. Add it to `.env.local`:
   ```
   NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/30min
   ```

> **Without this set**: The embed will show a placeholder Calendly page. Set this before launch.

---

## 4. Company Details

Review and update `src/data/site-data.ts` if any details have changed:

- [ ] `companyInfo.website` — your live URL
- [ ] `companyInfo.email` — your public contact email
- [ ] `companyInfo.phone` — your phone number
- [ ] `contactInfo.*` — matches the above
- [ ] `seoDefaults.url` — your live domain

---

## 5. Vercel Deployment (Recommended)

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. In the Vercel project settings, add all environment variables from `.env.local`
4. Connect your custom domain under **Settings → Domains**
5. Deploy

> All `NEXT_PUBLIC_*` variables are exposed to the browser. Keep secrets (like `RESEND_API_KEY`)
> as server-only variables (no `NEXT_PUBLIC_` prefix).

---

## 6. Final Checks Before Going Live

- [ ] Contact form submits and you receive the notification email
- [ ] Welcome email reaches the test inbox (check spam)
- [ ] Calendly embed loads correctly on the `/demo` page
- [ ] All pages load without errors
- [ ] Mobile navigation works correctly
- [ ] Dark and light mode both look correct (test with system preference toggle)
- [ ] Check WCAG AA colour contrast — especially on the lighter `text-fg-muted` elements
