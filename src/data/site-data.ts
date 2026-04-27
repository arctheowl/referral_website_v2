// Single source of truth — update once, reflected everywhere.

export const companyInfo = {
  name: "Rapid Reports",
  shortName: "RR",
  tagline: "Practical IT for Growing Businesses",
  description:
    "IT consultancy based in Andover, Hampshire. We help business owners and teams reduce manual work through process automation, custom software, and data tools.",
  website: "https://rapidreports.co.uk",
  email: "lidevlin@rapidreports.org",
  phone: "07548 859133",
  address: "Andover, Hampshire",
  founded: "2024",
};

export const contactInfo = {
  email: "lidevlin@rapidreports.org",
  phone: "07548 859133",
  primaryLocation: "Andover, Hampshire",
  businessHours: "Monday – Friday, 9 AM – 6 PM GMT",
  responseTime: "24 hours",
};

export const navigation = {
  main: [
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Demo", href: "/demo" },
  ],
  cta: { name: "Contact Us", href: "/contact" },
};

export const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Process Automation", href: "/services#automation" },
    { name: "Custom Software", href: "/services#software" },
    { name: "Data Analytics", href: "/services#analytics" },
    { name: "AI & Machine Learning", href: "/services#ai" },
    { name: "API Development", href: "/services#api" },
  ],
  getStarted: [
    { name: "Book a Demo", href: "/demo" },
    { name: "Free Evaluation", href: "/contact" },
    { name: "Get in Touch", href: "/contact" },
  ],
};

export const ctaLinks = {
  demo: "/demo",
  contact: "/contact",
  services: "/services",
  evaluation: "/contact",
} as const;

export const services = [
  {
    id: "evaluation",
    icon: "ClipboardCheck",
    title: "Free On-Site Business Evaluation",
    description:
      "We visit your workplace, map your current processes, and give you a written plan identifying exactly where time and money are being lost — at no cost and with no obligation.",
    highlights: [
      "On-site process walkthrough",
      "Written improvement plan",
      "No hard sell, ever",
    ],
    featured: true,
    label: "No Cost · No Commitment",
  },
  {
    id: "automation",
    icon: "Zap",
    title: "Process Automation",
    description:
      "Remove repetitive admin by connecting systems and automating routine tasks. Stop re-entering the same data.",
  },
  {
    id: "software",
    icon: "Code",
    title: "Custom Software Development",
    description:
      "When off-the-shelf tools don't fit, we build software around how your team actually works.",
  },
  {
    id: "analytics",
    icon: "BarChart3",
    title: "Data Analytics & Business Intelligence",
    description:
      "Turn disconnected spreadsheets into clear dashboards so decisions are based on facts, not guesswork.",
  },
  {
    id: "ai",
    icon: "Brain",
    title: "AI & Machine Learning",
    description:
      "Use AI where it genuinely helps: document handling, smarter forecasting, and support workflow automation.",
  },
  {
    id: "api",
    icon: "Link",
    title: "API Development & Integration",
    description:
      "Connect your systems so information moves reliably between tools without manual copying or export/import cycles.",
  },
];

export const serviceTiers = [
  {
    label: "Free Consultation",
    price: "£0",
    priceNote: "no obligation",
    bestFor:
      "Getting clarity on what can be automated and what level of effort and value to expect before committing.",
    examples: [
      "A walkthrough of one existing process with practical automation opportunities identified",
      "An honest assessment of quick wins versus longer-term projects",
      "A clear explanation of suitable tooling and approach",
    ],
    included: [
      "30-minute video or in-person call",
      "Process review and automation recommendations",
      "Written summary of findings within 24 hours",
    ],
  },
  {
    label: "Starter Automation",
    price: "from £450",
    bestFor: "A single, clearly defined task you want to hand off to a workflow.",
    examples: [
      "Auto-send emails or notifications when a form is submitted",
      "Automatically move or organise files based on set rules",
      "Populate a spreadsheet or report from a single data source",
    ],
    included: [
      "Scoping session (up to 1 hour)",
      "Build and testing",
      "Handover walkthrough so your team can use it straight away",
      "2 weeks of support after delivery",
    ],
  },
  {
    label: "Standard Automation",
    price: "from £1,000",
    bestFor: "Multi-step workflows connecting two or more tools or data sources.",
    examples: [
      "Pull data from multiple spreadsheets and generate formatted reports automatically",
      "Sync information between platforms (CRM, email, and calendar)",
      "Build an approval or sign-off workflow with automated notifications",
    ],
    included: [
      "Full process mapping session (up to 2 hours)",
      "Build, testing, and iteration",
      "Documentation so your team can manage it going forward",
      "4 weeks of support after delivery",
    ],
  },
  {
    label: "Complex Automation",
    price: "from £1,800",
    bestFor: "End-to-end automation across multiple systems, teams, or processes.",
    examples: [
      "Full onboarding/offboarding workflow across HR, IT, and comms tools",
      "Custom reporting dashboards pulling live data from multiple sources",
      "Multi-trigger automation with conditional logic and error handling",
    ],
    included: [
      "Discovery workshop (up to half a day)",
      "Full build, QA testing, and refinements",
      "Team training session",
      "Full documentation and process map",
      "6 weeks of post-delivery support",
    ],
  },
];

export const addOns = [
  { name: "Monthly maintenance and monitoring", price: "£150/month" },
  { name: "Additional tool integration", price: "From £150" },
  { name: "Extra training session for your team", price: "£100/session" },
  { name: "Priority turnaround (within 5 working days)", price: "+25% on project fee" },
];

export const howItWorks = [
  {
    title: "Free Consultation",
    description: "We look at your process together. No cost, no commitment.",
  },
  {
    title: "Proposal",
    description: "We send a fixed-price quote based on your specific needs. No surprise costs.",
  },
  {
    title: "Build",
    description: "We build, test, and refine the automation using your real data.",
  },
  {
    title: "Handover",
    description:
      "You get a full walkthrough and documentation so your team is confident using it.",
  },
  {
    title: "Support",
    description: "We stay on hand during the support window to handle any issues.",
  },
];

export const pricingFaqs = [
  {
    question: "Do I need to buy any software?",
    answer:
      "Sometimes, yes, depending on the tools involved. We always flag any costs upfront in the proposal. Many automations can be built using tools you already have, or free-tier software.",
  },
  {
    question: "What if my process changes after you have built it?",
    answer:
      "Small changes within the support window are covered. Larger changes are quoted separately — usually a fraction of the original project cost.",
  },
  {
    question: "What types of businesses do you work with?",
    answer:
      "Any sector. If your team spends one or more hours a week on a repetitive task, there is a good chance automation can reduce that significantly.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Starter automations typically take 3 to 5 working days. Standard projects take 1 to 2 weeks. Complex projects take 3 to 6 weeks depending on scope.",
  },
];

export const contactFaqs = [
  {
    question: "Do you offer a free evaluation?",
    answer:
      "Yes. We visit your workplace, review your current processes, and provide a written plan identifying practical improvements — at no cost and with no obligation to proceed.",
  },
  {
    question: "How quickly do you respond?",
    answer:
      "We aim to respond to all enquiries within 24 hours on working days. For urgent matters, call us directly.",
  },
  {
    question: "Do you work with businesses outside of Hampshire?",
    answer:
      "Yes. While we're based in Andover, we work with businesses across the UK. Remote consultations are available for initial conversations.",
  },
];

export const serviceOptions = [
  { value: "automation", label: "Process Automation" },
  { value: "custom-software", label: "Custom Software Development" },
  { value: "analytics", label: "Data Analytics & BI" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "api", label: "API Development" },
  { value: "evaluation", label: "Free On-Site Evaluation" },
  { value: "other", label: "Other / Not Sure Yet" },
];

export const seoDefaults = {
  siteName: "Rapid Reports",
  title: "Rapid Reports — IT Consultancy, Andover Hampshire",
  description:
    "Practical IT consultancy for small and mid-sized businesses. Process automation, custom software, and data analytics — starting with a free on-site business evaluation.",
  url: "https://rapidreports.co.uk",
};
