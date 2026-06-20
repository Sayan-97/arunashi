import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return new NextResponse("Failed to fetch file", {
        status: response.status,
      });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = `attachment; filename="${fileUrl.split("/").pop() || "download"}"`;

    return new NextResponse(response.body as unknown as BodyInit, {
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
