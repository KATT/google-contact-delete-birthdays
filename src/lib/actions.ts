"use server";

import { google, people_v1 } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedClient, getAuthUrl } from "./google";

export async function startOAuth() {
  const authUrl = getAuthUrl();
  redirect(authUrl);
}

export async function setAuthToken(options: { token: string }) {
  const cookieStore = await cookies();
  cookieStore.set("google_token", options.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("google_token");
}

export async function setBirthdays(options: {
  resourceName: string;
  birthdays: people_v1.Schema$Birthday[];
  etag: string;
}) {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");
  const people = google.people({ version: "v1", auth });

  // Perform the deletion
  try {
    const updateResult = await people.people.updateContact({
      resourceName: options.resourceName,
      updatePersonFields: "birthdays",
      requestBody: {
        resourceName: options.resourceName,
        etag: options.etag,
        birthdays: options.birthdays,
      },
    });

    return {
      success: true as const,
      etag: updateResult.data.etag,
    };
  } catch (error) {
    console.error("Error setting birthdays:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("google_token")?.value;
  return !!token;
}
