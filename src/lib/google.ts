import { google } from "googleapis";
import { cookies } from "next/headers";

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${
      process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
    }/auth/callback`
  );
}

export function getAuthUrl() {
  const auth = getOAuth2Client();
  return auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/contacts"],
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

  return responses
    .flatMap((it) => it.data.connections || [])
    .map((it) => {
      const primaryName =
        it.names?.find((it) => it.metadata?.primary) || it.names?.[0];

      const primaryEmail =
        it.emailAddresses?.find((it) => it.metadata?.primary)?.value ||
        it.emailAddresses?.[0]?.value ||
        null;

      const primaryPhoneNumber =
        it.phoneNumbers?.find((it) => it.metadata?.primary)?.value ||
        it.phoneNumbers?.[0]?.value ||
        null;
      const displayName =
        primaryName?.displayName ||
        [primaryName?.givenName, primaryName?.familyName]
          .filter(Boolean)
          .join(" ") ||
        primaryEmail ||
        primaryPhoneNumber ||
        null;

      return {
        ...it,
        displayName,
        hasBirthday: it.birthdays?.some((it) => it.date),
      };
    })
    .filter((it) => {
      if (!it.displayName && !it.hasBirthday) {
        console.dir(
          {
            msg: "No display name or birthday found",
            contact: it,
          },
          { depth: null }
        );
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.displayName && b.displayName) {
        return a.displayName.localeCompare(b.displayName);
      }
      if (a.displayName) {
        return -1;
      }
      return 1;
    });
}
