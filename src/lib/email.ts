import { Resend } from "resend";
import { companyInfo, contactInfo } from "@/data/site-data";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function fromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? `Rapid Reports <onboarding@resend.dev>`;
}

export async function sendContactNotificationEmail(payload: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}) {
  if (!resend) return { status: "skipped" as const };

  await resend.emails.send({
    from: fromAddress(),
    to: [process.env.CONTACT_EMAIL ?? contactInfo.email],
    replyTo: payload.email,
    subject: `New enquiry from ${payload.firstName} ${payload.lastName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#18E299;border-bottom:2px solid #18E299;padding-bottom:10px;">
          New Contact Form Submission
        </h2>
        <div style="background:#f8f8f8;padding:20px;border-radius:8px;margin:20px 0;">
          <p><strong>Name:</strong> ${payload.firstName} ${payload.lastName}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          ${payload.company ? `<p><strong>Company:</strong> ${payload.company}</p>` : ""}
          ${payload.service ? `<p><strong>Service interest:</strong> ${payload.service}</p>` : ""}
        </div>
        <div style="background:#fff;padding:20px;border:1px solid #e5e5e5;border-radius:8px;">
          <h3 style="margin-top:0;">Message</h3>
          <p style="white-space:pre-wrap;line-height:1.6;">${payload.message}</p>
        </div>
      </div>
    `,
  });

  return { status: "sent" as const };
}

export async function sendWelcomeEmail(payload: {
  to: string;
  firstName?: string;
}) {
  if (!resend) return { status: "skipped" as const };

  const name = payload.firstName?.trim() || "there";

  await resend.emails.send({
    from: fromAddress(),
    to: [payload.to],
    subject: `Thanks for getting in touch — ${companyInfo.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h2 style="color:#18E299;">Thanks for reaching out, ${name}.</h2>
        <p>We've received your message and will get back to you within ${contactInfo.responseTime}.</p>
        <p>In the meantime, if you have an urgent question you can call us on
           <strong>${contactInfo.phone}</strong> during business hours.</p>
        <p style="color:#666;font-size:14px;">
          ${contactInfo.businessHours} &middot; ${contactInfo.primaryLocation}
        </p>
        <p>— The ${companyInfo.name} team</p>
      </div>
    `,
  });

  return { status: "sent" as const };
}
