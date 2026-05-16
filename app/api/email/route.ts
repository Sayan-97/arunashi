import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Initialize the Nodemailer transport system using Gmail settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    // Ensure environment variables are loaded securely
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing Gmail SMTP environment variables.");
      return NextResponse.json(
        { error: "Server email configuration missing" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const {
      clientName,
      company,
      email,
      phone,
      address,
      pressPublicationTitle,
    } = body;

    // Validate fields
    if (!clientName || !company || !email || !phone || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // CHANGE THIS TO ANY EMAIL ADDRESS YOU WANT TO SEND TO FOR YOUR DEMO
    const targetAdminEmail = "sayandey4232@gmail.com";

    const mailOptions = {
      from: `"Arunashi System" <${process.env.GMAIL_USER}>`,
      to: targetAdminEmail,
      subject: `New Onboarding Request from ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <p style="font-size: 16px;">Dear Admin,</p>
            <p style="font-size: 14px;">You have received a new onboarding request for the Arunashi Retailer Portal.</p>
            
            <div style="margin-top: 20px;">
              <p style="margin: 0; font-size: 14px;"><strong>Applicant Details:</strong></p>
              <table style="margin-top: 10px; font-size: 14px; width: 100%;">
                  <tr><td style="padding: 4px 8px 4px 0; width: 150px;"><strong>Client Name:</strong></td><td>${clientName}</td></tr>
                  <tr><td style="padding: 4px 8px 4px 0;"><strong>Company:</strong></td><td>${company}</td></tr>
                  <tr><td style="padding: 4px 8px 4px 0;"><strong>Email:</strong></td><td>${email}</td></tr>
                  <tr><td style="padding: 4px 8px 4px 0;"><strong>Phone:</strong></td><td>${phone}</td></tr>
                  <tr><td style="padding: 4px 8px 4px 0;"><strong>Address:</strong></td><td>${address}</td></tr>
                  ${pressPublicationTitle ? `<tr><td style="padding: 4px 8px 4px 0;"><strong>Press Title:</strong></td><td>${pressPublicationTitle}</td></tr>` : ""}
              </table>
            </div>

            <p style="margin-top: 30px; font-size: 14px;">Best Regards,<br/><strong>Arunashi System</strong></p>
        </div>
      `,
    };

    // Trigger the email dispatch
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Nodemailer Error Details:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
