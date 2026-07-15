import path from "node:path";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER?.replace(/^["']|["']$/g, "").trim();
const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(
  /^["']|["']$/g,
  "",
).trim();

// Initialize the Nodemailer transport system using Gmail settings
async function sendMailWithFallback(options: nodemailer.SendMailOptions) {
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
}

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
    const { to, product, showMsrp, subject } = body;

    // Validate fields
    if (!to || !product || !product.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const msrpSection =
      showMsrp && product.msrp
        ? `<p style="font-size: 16px; font-weight: bold; color: #111; margin: 5px 0 0 0;">Retail Price: $${Number(product.msrp).toLocaleString()} USD</p>`
        : "";

    const itemNoSection = product.itemNumber
      ? `<p style="font-size: 13px; color: #666; margin: 4px 0 0 0;">Item No: ${product.itemNumber}</p>`
      : "";

    const collectionSection = product.collection
      ? `<p style="font-size: 13px; color: #627426; font-weight: 600; text-transform: uppercase; margin: 0 0 4px 0; letter-spacing: 0.5px;">${product.collection}</p>`
      : "";

    const descSection = product.des
      ? `<p style="font-size: 14px; color: #555; line-height: 1.5; margin: 15px 0 0 0; text-align: left;">${product.des}</p>`
      : `<p style="font-size: 14px; color: #777; line-height: 1.5; margin: 15px 0 0 0; font-style: italic; text-align: left;">No description available.</p>`;

    const imgSection = product.imageUrl
      ? `<div style="text-align: center; background-color: #fbfbfb; border: 1px solid #eee; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
          <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100%; max-height: 250px; object-fit: contain; display: inline-block;" />
         </div>`
      : "";

    const mailOptions = {
      from: `"Arunashi System" <${gmailUser}>`,
      to,
      subject: subject || `Shared Product: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="cid:arunashi-logo" alt="Arunashi" style="height: 45px; object-fit: contain; display: inline-block;" />
          </div>
          
          <div style="text-align: center; border-bottom: 2px solid #627426; padding-bottom: 15px; margin-bottom: 25px;">
            <h2 style="color: #627426; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">Product Details</h2>
          </div>

          ${imgSection}

          <div style="padding: 0 10px;">
            ${collectionSection}
            <h3 style="font-size: 20px; font-weight: bold; color: #111; margin: 0 0 8px 0; text-align: left;">${product.name}</h3>
            ${itemNoSection}
            ${msrpSection}
            ${descSection}
          </div>

          ${
            product.shareUrl
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${product.shareUrl}" style="background-color: #627426; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              View Product Details
            </a>
          </div>`
              : ""
          }

          <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 15px;">Best Regards,<br/><strong>Arunashi System</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: "app-logo.png",
          path: path.join(process.cwd(), "public", "app-logo.png"),
          cid: "arunashi-logo",
        },
      ],
    };

    const info = await sendMailWithFallback(mailOptions);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Nodemailer Email Sharing Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 },
    );
  }
}
