import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      clientName,
      company,
      email,
      phone,
      address,
      pressPublicationTitle,
    } = await req.json();

    if (!clientName || !company || !email || !phone || !address) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["sayandey4232@gmail.com"],
      subject: `New Onboarding Request from ${clientName}`,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    
    <p style="font-size: 16px;">Dear Admin,</p>

    <p style="font-size: 14px;">
      You have received a new onboarding request for the Arunashi Retailer Portal.
    </p>

    <div style="margin-top: 20px;">
      <p style="margin: 0; font-size: 14px;"><strong>Applicant Details:</strong></p>
      
      <table style="margin-top: 10px; font-size: 14px;">
        <tr>
          <td style="padding: 4px 8px 4px 0;"><strong>Client Name:</strong></td>
          <td>${clientName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0;"><strong>Company:</strong></td>
          <td>${company}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0;"><strong>Email:</strong></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0;"><strong>Phone:</strong></td>
          <td>${phone}</td>
        </tr>
        <tr>
          <td style="padding: 4px 8px 4px 0;"><strong>Address:</strong></td>
          <td>${address}</td>
        </tr>
        ${
          pressPublicationTitle
            ? `
        <tr>
          <td style="padding: 4px 8px 4px 0;"><strong>Press Publication Title:</strong></td>
          <td>${pressPublicationTitle}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <p style="margin-top: 30px; font-size: 14px;">
      Best Regards,<br/>
      <strong>Arunashi System</strong>
    </p>

  </div>
`,
    });

    return Response.json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
