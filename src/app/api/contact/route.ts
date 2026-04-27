import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sendContactNotificationEmail, sendWelcomeEmail } from "@/lib/email";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Payload;

    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const message = String(body.message ?? "").trim();
    const company = String(body.company ?? "").trim();
    const service = String(body.service ?? "").trim();

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Sync contact to Resend audience if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (resendApiKey && audienceId) {
      try {
        const resend = new Resend(resendApiKey);
        const contact = await resend.contacts.create({
          audienceId,
          email,
          firstName,
          lastName,
          unsubscribed: false,
        });
        if (contact.data?.id) {
          await resend.events.send({
            event: "form_submit",
            contactId: contact.data.id,
            payload: { company: company || null, service: service || null, message },
          });
        }
      } catch (err) {
        console.error("Resend audience sync failed:", err);
      }
    }

    // Send notification to owner + welcome email to visitor
    await sendContactNotificationEmail({ firstName, lastName, email, company, service, message });
    await sendWelcomeEmail({ to: email, firstName });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
