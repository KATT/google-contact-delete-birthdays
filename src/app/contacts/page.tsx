import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DeleteButton } from "./delete-button";

export const metadata: Metadata = {
  title: "Manage Contact Birthdays - Google Contacts Birthday Manager",
  description:
    "View and manage birthday information for your Google Contacts. Remove unwanted birthday notifications with one click. Secure and private.",
  keywords: [
    "contact birthday management",
    "Google Contacts birthdays",
    "remove birthday notifications",
    "contact cleanup",
    "birthday data removal",
  ],
  openGraph: {
    title: "Manage Contact Birthdays - Google Contacts Birthday Manager",
    description:
      "View and manage birthday information for your Google Contacts. Remove unwanted birthday notifications with one click.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og?title=Manage%20Contact%20Birthdays&description=View%20and%20manage%20birthday%20information%20for%20your%20Google%20Contacts",
        width: 1200,
        height: 630,
        alt: "Manage Contact Birthdays - Google Contacts Birthday Manager",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Contact Birthdays - Google Contacts Birthday Manager",
    description:
      "View and manage birthday information for your Google Contacts. Remove unwanted birthday notifications with one click.",
  },
  robots: {
    index: false, // This page requires authentication
    follow: true,
  },
  alternates: {
    canonical: "/contacts",
  },
};

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
      <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
        <CardContent className="pt-8">
          <div className="text-center py-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-muted/50">
                <Users className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No contacts with birthdays found
            </h3>
            <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
              All your contacts either don&apos;t have birthday information or
              it has already been removed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              Contacts with Birthdays
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Click the clear button to remove birthday information from a
              contact
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
            {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Birthday
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow
                  key={contact.resourceName}
                  className={`transition-colors hover:bg-primary/5 ${
                    index % 2 === 0 ? "bg-card" : "bg-muted/10"
                  }`}
                >
                  <TableCell className="font-medium py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground">
                        {contact.displayName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-mono text-sm bg-muted/30 px-3 py-1 rounded-md inline-block">
                      {contact.birthdays
                        ?.filter((it) => !!it.date)
                        .map((it) => {
                          const date = it.date!;

                          const year = date.year ?? "????";
                          const month =
                            date.month?.toString().padStart(2, "0") ?? "??";
                          const day =
                            date.day?.toString().padStart(2, "0") ?? "??";

                          return `${year}-${month}-${day}`;
                        })
                        .join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
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
        </div>
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
    <Card className="border border-destructive/20 bg-destructive/5 backdrop-blur-sm shadow-lg">
      <CardContent className="pt-8">
        <div className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-destructive/10">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-destructive mb-2">
            Error Loading Contacts
          </h3>
          <p className="text-muted-foreground text-base mb-6 max-w-md mx-auto">
            {errorMessage}
          </p>
          <form action={handleRetry}>
            <Button
              type="submit"
              variant="outline"
              className="gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
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
    <Card className="border border-amber-200 bg-amber-50/50 backdrop-blur-sm shadow-lg">
      <CardContent className="pt-8">
        <div className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-amber-100">
              <AlertTriangle className="h-16 w-16 text-amber-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-amber-800 mb-2">
            Authentication Required
          </h3>
          <p className="text-muted-foreground text-base mb-6 max-w-md mx-auto">
            Your session has expired. Please sign in again to access your
            contacts.
          </p>
          <form action={handleReauth}>
            <Button
              type="submit"
              variant="default"
              className="gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4" />
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
      <Button
        variant="outline"
        size="sm"
        className="gap-2 shadow-md hover:shadow-lg transition-all duration-200"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </form>
  );
}

function ContactsPageSkeleton() {
  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Birthday</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <Skeleton className="h-8 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              asChild
              variant="outline"
              className="w-fit shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Your Contacts
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage birthday information for your Google Contacts
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <Button
            asChild
            variant="secondary"
            className="w-fit shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link
              href={isShowingAll ? "/contacts" : "/contacts?showAll=1"}
              prefetch
              className="gap-2"
            >
              {isShowingAll ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Show only Contacts with Birthdays
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show All Contacts
                </>
              )}
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground">
            {isShowingAll
              ? "Showing all contacts"
              : "Showing contacts with birthdays only"}
          </div>
        </div>

        {/* Contacts List */}
        <Suspense fallback={<ContactsPageSkeleton />}>
          <ContactsList showAll={isShowingAll} />
        </Suspense>
      </div>
    </div>
  );
}
