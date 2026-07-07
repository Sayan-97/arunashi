"use server";

import nodemailer from "nodemailer";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  const { name, email, message } = data;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  const gmailUser = process.env.GMAIL_USER?.replace(/^["']|["']$/g, "").trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(
    /^["']|["']$/g,
    "",
  ).trim();

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

  const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #627426; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #627426; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">New Contact Inquiry</h2>
        </div>

        <p style="font-size: 15px; color: #333;">Hello Admin,</p>
        <p style="font-size: 15px; color: #333;">You have received a new message from the contact form on your storefront. Please review the details below:</p>

        <!-- Sender Details Box -->
        <div style="background-color: #faf9f6; border: 1px solid #eeeeee; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <h3 style="color: #627426; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Sender Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #666; width: 80px; text-align: left;"><strong>Name:</strong></td>
              <td style="padding: 4px 0; color: #111; text-align: left;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #666; text-align: left;"><strong>Email:</strong></td>
              <td style="padding: 4px 0; color: #111; text-align: left;"><a href="mailto:${email}" style="color: #627426; text-decoration: none;">${email}</a></td>
            </tr>
          </table>
        </div>

        <!-- Message Box -->
        <h3 style="color: #627426; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Message</h3>
        <div style="background-color: #faf9f6; border: 1px solid #eeeeee; border-radius: 6px; padding: 15px; font-size: 14px; white-space: pre-wrap; color: #444;">
          ${message}
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center; margin-top: 15px;">Best Regards,<br/><strong>Arunashi System</strong></p>
      </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Arunashi Storefront" <${gmailUser}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: emailHtml,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return {
      success: false,
      error: "Failed to send email. Please try again later.",
    };
  }
}
