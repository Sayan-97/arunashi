import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER?.replace(/^["']|["']$/g, "").trim();
const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(
  /^["']|["']$/g,
  "",
).trim();

// Initialize the Nodemailer transport system using Gmail settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(req: Request) {
  try {
    // Ensure environment variables are loaded securely
    if (!gmailUser || !gmailPass) {
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
      city,
      state,
      country,
      zipcode,
      pressPublicationTitle,
    } = body;

    // Validate fields
    if (
      !clientName ||
      !company ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !country ||
      !zipcode
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // CHANGE THIS TO ANY EMAIL ADDRESS YOU WANT TO SEND TO FOR YOUR DEMO
    const targetAdminEmail = "sales@arunashi.com";

    const mailOptions = {
      from: `"Arunashi System" <${gmailUser}>`,
      to: targetAdminEmail,
      subject: `New Onboarding Request from ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #627426; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #627426; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">New Onboarding Request</h2>
          </div>

          <p style="font-size: 15px; color: #333;">Hello Admin,</p>
          <p style="font-size: 15px; color: #333;">You have received a new onboarding request for the Arunashi Retailer Portal. Please review the details below:</p>

          <div style="background-color: #faf9f6; border: 1px solid #eeeeee; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #627426; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Applicant Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #666; width: 150px; text-align: left;"><strong>Client Name:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${clientName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Company:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${company}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Email:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;"><a href="mailto:${email}" style="color: #627426; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Phone:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Address:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>City:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${city}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>State:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${state}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Country:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Zip Code:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${zipcode}</td>
              </tr>
              ${
                pressPublicationTitle
                  ? `
              <tr>
                <td style="padding: 6px 0; color: #666; text-align: left;"><strong>Press Title:</strong></td>
                <td style="padding: 6px 0; color: #111; text-align: left;">${pressPublicationTitle}</td>
              </tr>`
                  : ""
              }
            </table>
          </div>

          <p style="font-size: 14px; color: #555;">You can review and manage this request in the Admin Panel.</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 15px;">Best Regards,<br/><strong>Arunashi System</strong></p>
        </div>
      `,
    };

    // Trigger the email dispatch
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}
