"use server";

import { people_v1 } from "googleapis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  deleteBirthdayFromContact,
  fetchContactsWithBirthdays,
  getAuthUrl,
  restoreBirthdayToContact,
} from "./google";

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

export async function getContacts() {
  try {
    return await fetchContactsWithBirthdays();
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

export async function deleteBirthday(options: {
  resourceName: string;
  etag: string;
}) {
  try {
    const result = await deleteBirthdayFromContact({
      resourceName: options.resourceName,
      etag: options.etag,
    });
    return {
      success: true as const,
      originalBirthdays: result.originalBirthdays,
      etag: result.updateResult.data.etag,
    };
  } catch (error) {
    console.error("Error deleting birthday:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function undoDeleteBirthday(options: {
  resourceName: string;
  originalBirthdays: people_v1.Schema$Birthday[];
}) {
  try {
    const result = await restoreBirthdayToContact({
      resourceName: options.resourceName,
      birthdays: options.originalBirthdays,
    });
    return {
      success: true as const,
      etag: result.data.etag,
    };
  } catch (error) {
    console.error("Error restoring birthday:", error);
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
