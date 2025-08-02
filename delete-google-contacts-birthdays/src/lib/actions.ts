'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  deleteBirthdayFromContact,
  fetchContactsWithBirthdays,
  getAuthUrl,
} from './google';

export async function startOAuth() {
  const authUrl = getAuthUrl();
  redirect(authUrl);
}

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('google_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete('google_token');
}

export async function getContacts() {
  try {
    return await fetchContactsWithBirthdays();
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
}

export async function deleteBirthday(resourceName: string, etag: string) {
  try {
    await deleteBirthdayFromContact(resourceName, etag);
    return { success: true };
  } catch (error) {
    console.error('Error deleting birthday:', error);
    return { success: false, error: 'Failed to delete birthday' };
  }
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get('google_token')?.value;
  return !!token;
}
