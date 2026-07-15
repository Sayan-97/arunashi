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

  const sendMailWithFallback = async (options: nodemailer.SendMailOptions) => {
    // First try Port 465 (SSL)
    try {
      const sslTransporter = nodemailer.createTransport({
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
        connectionTimeout: 2000,
        greetingTimeout: 2000,
      });
      return await sslTransporter.sendMail(options);
    } catch (sslError) {
      console.warn(
        "SMTP Port 465 failed, attempting Port 587 STARTTLS fallback...",
        sslError,
      );

      // Fall back to Port 587 (STARTTLS)
      const tlsTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
        connectionTimeout: 3000,
        greetingTimeout: 3000,
      });
      return await tlsTransporter.sendMail(options);
    }
  };

  const path = require("node:path");

  const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="cid:arunashi-logo" alt="Arunashi" style="height: 45px; object-fit: contain; display: inline-block;" />
        </div>

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
    await sendMailWithFallback({
      from: `"Arunashi Storefront" <${gmailUser}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: emailHtml,
      attachments: [
        {
          filename: "app-logo.png",
          path: path.join(process.cwd(), "public", "app-logo.png"),
          cid: "arunashi-logo",
        },
      ],
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
