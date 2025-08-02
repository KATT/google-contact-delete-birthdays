import { google, people_v1 } from "googleapis";
import { cookies } from "next/headers";

// Configuration
const SCOPES = ["https://www.googleapis.com/auth/contacts"];

export function getOAuth2Client() {
  // In a real app, these should be environment variables
  const credentials = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback",
    ],
  };

  return new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  );
}

export function getAuthUrl() {
  const auth = getOAuth2Client();
  return auth.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

export async function getTokenFromCode(code: string) {
  const auth = getOAuth2Client();
  const { tokens } = await auth.getToken(code);
  return tokens;
}

export async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("google_token")?.value;

  if (!token) {
    return null;
  }

  const auth = getOAuth2Client();
  auth.setCredentials(JSON.parse(token));
  return auth;
}

export async function fetchAllContacts() {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const people = google.people({ version: "v1", auth });

  async function fetchList(pageToken?: string) {
    return people.people.connections.list({
      resourceName: "people/me",
      pageSize: 1000,
      personFields: "names,birthdays,metadata",
      pageToken,
    });
  }

  let pageToken: string | undefined = undefined;
  const responses = [];

  let response;
  do {
    response = await fetchList(pageToken);
    pageToken = response.data.nextPageToken || undefined;
    responses.push(response);
  } while (pageToken);

  return responses;
}

export async function fetchContactsWithBirthdays() {
  const responses = await fetchAllContacts();
  const contacts = responses.map((it) => it.data.connections || []).flat();

  return contacts
    .filter((contact) => contact.birthdays?.filter((it) => it.date).length)
    .map((contact) => {
      const displayName = contact.names?.[0]?.displayName || "Unknown Contact";
      return {
        ...contact,
        displayName,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function getContactDetails(resourceName: string) {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const people = google.people({ version: "v1", auth });

  return people.people.get({
    resourceName,
    personFields: "birthdays,metadata",
  });
}

export async function deleteBirthdayFromContact(options: {
  resourceName: string;
  etag: string;
}) {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const people = google.people({ version: "v1", auth });

  // Get current contact data before deletion
  const currentContact = await people.people.get({
    resourceName: options.resourceName,
    personFields: "birthdays,metadata",
  });

  const originalBirthdays = currentContact.data.birthdays || [];

  // Perform the deletion
  const updateResult = await people.people.updateContact({
    resourceName: options.resourceName,
    updatePersonFields: "birthdays",
    requestBody: {
      resourceName: options.resourceName,
      etag: options.etag,
      birthdays: [], // Remove all birthdays
    },
  });

  return {
    updateResult,
    originalBirthdays,
  };
}

export async function restoreBirthdayToContact(options: {
  resourceName: string;
  birthdays: people_v1.Schema$Birthday[];
}) {
  const auth = await getAuthenticatedClient();
  if (!auth) throw new Error("Not authenticated");

  const people = google.people({ version: "v1", auth });

  // Get current contact data to get the latest etag
  const currentContact = await people.people.get({
    resourceName: options.resourceName,
    personFields: "birthdays,metadata",
  });

  return people.people.updateContact({
    resourceName: options.resourceName,
    updatePersonFields: "birthdays",
    requestBody: {
      resourceName: options.resourceName,
      etag: currentContact.data.etag,
      birthdays: options.birthdays,
    },
  });
}
