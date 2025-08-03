"use server";

import { google, people_v1 } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "./env";
import { getAuthenticatedClient, getAuthUrl } from "./google";

export async function startOAuth() {
  const authUrl = getAuthUrl();
  redirect(authUrl);
}

export async function setAuthToken(options: { token: string }) {
  const cookieStore = await cookies();
  cookieStore.set("google_token", options.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
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
  try {
    const auth = await getAuthenticatedClient();
    if (!auth) {
      return {
        success: false as const,
        error: "Not authenticated - please sign in again",
        requiresReauth: true,
      };
    }

    const people = google.people({ version: "v1", auth });

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

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const requiresReauth =
      errorMessage.includes("refresh token") ||
      errorMessage.includes("authentication") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("invalid_grant") ||
      errorMessage.includes("401");

    return {
      success: false as const,
      error: errorMessage,
      requiresReauth,
    };
  }
}

export async function handleReauth() {
  await clearAuthToken();
  await startOAuth();
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("google_token")?.value;
  return !!token;
}
