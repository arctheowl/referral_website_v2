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

    // Add submitter to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: contactError } = await resend.contacts.create({
        audienceId,
        email,
        firstName,
        lastName,
        unsubscribed: false,
        properties: {
          ...(company && { company }),
          ...(service && { service }),
          message,
        },
      });
      if (contactError) console.error("Resend contact creation failed:", contactError);
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
