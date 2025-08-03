import { isAuthenticated } from "@/lib/actions";
import { getAuthUrl } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authed = await isAuthenticated();

  if (authed) {
    return NextResponse.redirect(new URL("/contacts", request.url));
  }
  const authUrl = getAuthUrl();
  return NextResponse.redirect(authUrl);
}
