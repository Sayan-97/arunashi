"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

export interface ActionState {
  errors?: {
    email?: string[];
    password?: string[];
    form?: string;
  };
  success?: boolean;
}

export interface SignupActionState {
  errors?: {
    clientName?: string[];
    company?: string[];
    email?: string[];
    phone?: string[];
    address?: string[];
    city?: string[];
    state?: string[];
    country?: string[];
    zipcode?: string[];
    pressPublicationTitle?: string[];
    form?: string;
  };
  success?: boolean;
}

export async function login(
  _prevState: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: { email?: string[]; password?: string[]; form?: string } = {};

  if (!email || !email.includes("@")) {
    errors.email = ["Please enter a valid email address"];
  }
  if (!password || password.length === 0) {
    errors.password = ["Password is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let isSuccess = false;
  let isPendingApproval = false;

  try {
    const backendUrl = process.env.API_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 403 && data.error === "PENDING_APPROVAL") {
        isPendingApproval = true;
      } else if (data.error && typeof data.error === "object") {
        return {
          errors: data.error as { email?: string[]; password?: string[] },
        };
      } else {
        return {
          errors: {
            form: data.error || data.message || "Invalid credentials",
          },
        };
      }
    }

    if (!isPendingApproval) {
      // Set the authentication cookies on the client
      const setCookies = response.headers.getSetCookie();
      const cookieStore = await cookies();

      for (const cookieStr of setCookies) {
        const parts = cookieStr.split(";").map((p) => p.trim());
        const [nameValue, ...options] = parts;
        const eqIdx = nameValue.indexOf("=");
        if (eqIdx === -1) continue;
        const name = nameValue.substring(0, eqIdx);
        const value = nameValue.substring(eqIdx + 1);

        const cookieOptions: {
          path?: string;
          httpOnly?: boolean;
          secure?: boolean;
          maxAge?: number;
          sameSite?: "lax" | "strict" | "none";
          expires?: Date;
        } = {};
        for (const option of options) {
          const [optName, optVal] = option.split("=");
          const normalizedName = optName.toLowerCase();
          if (normalizedName === "path") {
            cookieOptions.path = optVal || "/";
          } else if (normalizedName === "httponly") {
            cookieOptions.httpOnly = true;
          } else if (normalizedName === "secure") {
            cookieOptions.secure = true;
          } else if (normalizedName === "max-age") {
            cookieOptions.maxAge = parseInt(optVal, 10);
          } else if (normalizedName === "samesite") {
            cookieOptions.sameSite = optVal.toLowerCase() as
              | "lax"
              | "strict"
              | "none";
          } else if (normalizedName === "expires") {
            cookieOptions.expires = new Date(optVal);
          }
        }

        cookieStore.set(name, value, cookieOptions);
      }

      isSuccess = true;
    }
  } catch (error) {
    console.error("Login Server Action Error:", error);
    return {
      errors: {
        form: "Could not connect to the authentication server.",
      },
    };
  }

  if (isPendingApproval) {
    const cookieStore = await cookies();
    cookieStore.set("signup_success", "true", { maxAge: 15, path: "/" });
    redirect("/submission");
  }

  if (isSuccess) {
    redirect("/");
  }

  return { success: true };
}

export async function signup(
  _prevState: SignupActionState | undefined,
  formData: FormData,
): Promise<SignupActionState> {
  const clientName = formData.get("clientName") as string;
  const company = formData.get("company") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const country = formData.get("country") as string;
  const zipcode = formData.get("zipcode") as string;
  const pressPublicationTitle = formData.get("pressPublicationTitle") as string;

  const errors: NonNullable<SignupActionState["errors"]> = {};

  if (!clientName || clientName.trim().length === 0) {
    errors.clientName = ["Client name is required"];
  }
  if (!company || company.trim().length === 0) {
    errors.company = ["Company is required"];
  }
  if (!email || !email.includes("@")) {
    errors.email = ["Please enter a valid email address"];
  }
  if (!phone || phone.trim().length === 0) {
    errors.phone = ["Phone is required"];
  }
  if (!address || address.trim().length === 0) {
    errors.address = ["Address is required"];
  }
  if (!city || city.trim().length === 0) {
    errors.city = ["City is required"];
  }
  if (!state || state.trim().length === 0) {
    errors.state = ["State/Province is required"];
  }
  if (!country || country.trim().length === 0) {
    errors.country = ["Country is required"];
  }
  if (!zipcode || zipcode.trim().length === 0) {
    errors.zipcode = ["Zip/Postal Code is required"];
  }
  if (!pressPublicationTitle || pressPublicationTitle.trim().length === 0) {
    errors.pressPublicationTitle = ["Press publication title is required"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let isSuccess = false;

  try {
    const backendUrl = process.env.API_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/registration/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: clientName,
        email,
        company,
        phone,
        address,
        city,
        state,
        country,
        zipcode,
        pressTitle: pressPublicationTitle,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && typeof data.error === "object") {
        const mappedErrors: NonNullable<SignupActionState["errors"]> = {};
        const backendErr = data.error as Record<string, string[]>;
        if (backendErr.name) mappedErrors.clientName = backendErr.name;
        if (backendErr.company) mappedErrors.company = backendErr.company;
        if (backendErr.email) mappedErrors.email = backendErr.email;
        if (backendErr.phone) mappedErrors.phone = backendErr.phone;
        if (backendErr.address) mappedErrors.address = backendErr.address;
        if (backendErr.city) mappedErrors.city = backendErr.city;
        if (backendErr.state) mappedErrors.state = backendErr.state;
        if (backendErr.country) mappedErrors.country = backendErr.country;
        if (backendErr.zipcode) mappedErrors.zipcode = backendErr.zipcode;
        if (backendErr.pressTitle)
          mappedErrors.pressPublicationTitle = backendErr.pressTitle;
        return { errors: mappedErrors };
      }
      return {
        errors: {
          form: data.error || data.message || "Registration request failed.",
        },
      };
    }

    // Attempt to send email notification to the admin
    try {
      const gmailUser = process.env.GMAIL_USER?.replace(
        /^["']|["']$/g,
        "",
      ).trim();
      const gmailPass = process.env.GMAIL_APP_PASSWORD?.replace(
        /^["']|["']$/g,
        "",
      ).trim();

      const sendMailWithFallback = async (
        options: nodemailer.SendMailOptions,
      ) => {
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

      const targetAdminEmail =
        process.env.ADMIN_EMAIL || "sayandey4232@gmail.com";

      const path = require("node:path");

      const mailOptions = {
        from: `"Arunashi System" <${gmailUser}>`,
        to: targetAdminEmail,
        subject: `New Onboarding Request from ${clientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 8px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 25px;">
              <img src="cid:arunashi-logo" alt="Arunashi" style="height: 45px; object-fit: contain; display: inline-block;" />
            </div>

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
        attachments: [
          {
            filename: "app-logo.png",
            path: path.join(process.cwd(), "public", "app-logo.png"),
            cid: "arunashi-logo",
          },
        ],
      };

      await sendMailWithFallback(mailOptions);
    } catch (emailErr) {
      console.error("Nodemailer Error in Server Action:", emailErr);
    }

    isSuccess = true;
  } catch (error) {
    console.error("Signup Server Action Error:", error);
    return {
      errors: {
        form: "Could not connect to the backend server.",
      },
    };
  }

  if (isSuccess) {
    const cookieStore = await cookies();
    cookieStore.set("signup_success", "true", { maxAge: 15, path: "/" });
    redirect("/submission");
  }

  return { success: true };
}

export interface ActivateActionState {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    form?: string;
  };
  success?: boolean;
}

export async function activate(
  _prevState: ActivateActionState | undefined,
  formData: FormData,
): Promise<ActivateActionState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: NonNullable<ActivateActionState["errors"]> = {};

  if (!token || token.trim().length === 0) {
    errors.form = "Activation token is missing or invalid.";
  }
  if (!password || password.length === 0) {
    errors.password = ["Password is required."];
  } else if (password.length < 6) {
    errors.password = ["Password must be at least 6 characters."];
  }
  if (!confirmPassword || confirmPassword.length === 0) {
    errors.confirmPassword = ["Please confirm your password."];
  } else if (password !== confirmPassword) {
    errors.confirmPassword = ["Passwords do not match."];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let isSuccess = false;

  try {
    const backendUrl = process.env.API_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/auth/activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && typeof data.error === "object") {
        return {
          errors: data.error as {
            password?: string[];
            confirmPassword?: string[];
          },
        };
      }
      return {
        errors: {
          form: data.error || data.message || "Activation failed.",
        },
      };
    }

    isSuccess = true;
  } catch (error) {
    console.error("Activation Server Action Error:", error);
    return {
      errors: {
        form: "Could not connect to the backend server.",
      },
    };
  }

  if (isSuccess) {
    const cookieStore = await cookies();
    cookieStore.set("activation_success", "true", { maxAge: 15, path: "/" });
    redirect("/activation-status");
  }

  return { success: true };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("arunashiAccessToken");
  cookieStore.delete("arunashiRefreshToken");
  redirect("/login");
}
