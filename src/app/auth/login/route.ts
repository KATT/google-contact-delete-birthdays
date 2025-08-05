import { isAuthenticated } from "@/lib/actions";
import { getAuthUrl } from "@/lib/google";
import { NextResponse } from "next/server";

export async function GET() {
  const authed = await isAuthenticated();

  if (authed) {
    return NextResponse.redirect("/contacts");
  }
  const authUrl = getAuthUrl();
  return NextResponse.redirect(authUrl);
}
