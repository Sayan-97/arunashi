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

        const cookieOptions: any = {};
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
  const pressPublicationTitle = formData.get("pressPublicationTitle") as string;

  const errors: any = {};

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
        pressTitle: pressPublicationTitle,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && typeof data.error === "object") {
        const mappedErrors: any = {};
        const backendErr = data.error as Record<string, string[]>;
        if (backendErr.name) mappedErrors.clientName = backendErr.name;
        if (backendErr.company) mappedErrors.company = backendErr.company;
        if (backendErr.email) mappedErrors.email = backendErr.email;
        if (backendErr.phone) mappedErrors.phone = backendErr.phone;
        if (backendErr.address) mappedErrors.address = backendErr.address;
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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const targetAdminEmail =
        process.env.ADMIN_EMAIL || "sayandey4232@gmail.com";

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
                    <tr><td style="padding: 4px 8px 4px 0;"><strong>Press Title:</strong></td><td>${pressPublicationTitle}</td></tr>
                </table>
              </div>

              <p style="margin-top: 30px; font-size: 14px;">Best Regards,<br/><strong>Arunashi System</strong></p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
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

  const errors: any = {};

  if (!token || token.trim().length === 0) {
    errors.form = ["Activation token is missing or invalid."];
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
    redirect("/activation-status");
  }

  return { success: true };
}
