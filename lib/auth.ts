import { cookies } from "next/headers";

/**
 * Returns the formatted cookie string containing only the arunashi storefront tokens.
 * This ensures backend requests do not mistakenly receive admin tokens.
 */
export async function getAuthCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("arunashiAccessToken")?.value;
  const refreshToken = cookieStore.get("arunashiRefreshToken")?.value;

  const cookieParts = [];
  if (accessToken) cookieParts.push(`arunashiAccessToken=${accessToken}`);
  if (refreshToken) cookieParts.push(`arunashiRefreshToken=${refreshToken}`);

  return cookieParts.join("; ");
}
