import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl = fileUrl;
  if (fileUrl.startsWith("/")) {
    const backendUrl = process.env.API_URL || "http://localhost:8000";
    targetUrl = `${backendUrl}${fileUrl}`;
  }

  try {
    targetUrl = new URL(targetUrl).href;
  } catch (err) {
    console.error("URL encoding error in download route:", err);
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return new NextResponse("Failed to fetch file", {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Extract original filename from the path
    const filename = decodeURIComponent(
      fileUrl.split("/").pop() || "download.pdf",
    );
    const contentDisposition = `attachment; filename="${filename}"`;

    const dataBuffer = await response.arrayBuffer();

    return new NextResponse(dataBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Download proxy error:", error);
    return new NextResponse("Failed to download file", { status: 500 });
  }
}
