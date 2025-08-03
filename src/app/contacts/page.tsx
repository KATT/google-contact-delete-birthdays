import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clearAuthToken, isAuthenticated, startOAuth } from "@/lib/actions";
import { fetchAllContacts } from "@/lib/google";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Filter,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DeleteButton } from "./delete-button";

async function ContactsList(props: { showAll: boolean }) {
  let contacts;
  try {
    contacts = await fetchAllContacts();
    if (!props.showAll) {
      contacts = contacts.filter((it) => it.hasBirthday);
    }
  } catch (error) {
    console.warn("Error loading contacts:", error);

    // Check if it's an authentication error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const isAuthError =
      errorMessage.includes("refresh token") ||
      errorMessage.includes("authentication") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("Not authenticated");

    if (isAuthError) {
      return <AuthenticationError />;
    }

    // For other errors, show a generic error
    return <GenericError errorMessage={errorMessage} />;
  }

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No contacts with birthdays found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              All your contacts either don&apos;t have birthday information or
              it has already been removed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Contacts with Birthdays ({contacts.length})
        </CardTitle>
        <CardDescription>
          Click the delete button to remove birthday information from a contact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.resourceName}>
                <TableCell className="font-medium">
                  {contact.displayName}
                </TableCell>
                <TableCell>
                  {contact.birthdays
                    ?.filter((it) => !!it.date)
                    .map((it) => {
                      const date = it.date!;

                      const year = date.year ?? "????";
                      const month =
                        date.month?.toString().padStart(2, "0") ?? "??";
                      const day = date.day?.toString().padStart(2, "0") ?? "??";

                      return `${year}-${month}-${day}`;
                    })
                    .join(", ")}
                </TableCell>
                <TableCell className="text-right">
                  {contact.hasBirthday && (
                    <DeleteButton
                      resourceName={contact.resourceName!}
                      etag={contact.etag!}
                      birthdays={contact.birthdays || []}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

async function GenericError({ errorMessage }: { errorMessage: string }) {
  async function handleRetry() {
    "use server";
    redirect("/contacts");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">
            Error Loading Contacts
          </p>
          <p className="text-gray-500 text-sm mt-2">{errorMessage}</p>
          <form action={handleRetry} className="mt-4">
            <Button type="submit" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

async function AuthenticationError() {
  async function handleReauth() {
    "use server";
    await clearAuthToken();
    await startOAuth();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-600 text-lg font-medium">
            Authentication Required
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Your session has expired. Please sign in again to access your
            contacts.
          </p>
          <form action={handleReauth} className="mt-4">
            <Button type="submit" variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sign In Again
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

async function LogoutButton() {
  async function handleLogout() {
    "use server";
    await clearAuthToken();
    redirect("/");
  }

  return (
    <form action={handleLogout}>
      <Button variant="outline" size="sm">
        Logout
      </Button>
    </form>
  );
}

export default async function ContactsPage(props: {
  searchParams: Promise<{
    showAll: string;
  }>;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/");
  }

  const { showAll } = await props.searchParams;
  const isShowingAll = showAll === "1";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Contacts</h1>
            <p className="text-gray-600">
              Manage birthday information for your Google Contacts
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>

      <Alert className="mb-6">
        <Trash2 className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Deleting birthday information is permanent.
          Make sure you want to remove this data before proceeding.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center mb-4">
        <Link href={isShowingAll ? "/" : "/contacts?showAll=1"} prefetch>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {isShowingAll
              ? "Show only Contacts with Birthdays"
              : "Show All Contacts"}
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading your contacts...</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <ContactsList showAll={isShowingAll} />
      </Suspense>
    </div>
  );
}
