import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isAuthenticated, startOAuth } from "@/lib/actions";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Gift,
  Info,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import Link from "next/link";

interface HomeProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const authenticated = await isAuthenticated();
  const { error } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {error && (
        <Alert className="mb-8 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Authentication Error:</strong>{" "}
            {error === "oauth_error" &&
              "OAuth authentication failed. Please try again."}
            {error === "no_code" &&
              "No authorization code received. Please try again."}
            {error === "token_error" &&
              "Failed to exchange code for token. Please try again."}
            {!["oauth_error", "no_code", "token_error"].includes(error) &&
              "An unexpected error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Calendar className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Google Contacts Birthday Manager
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Clean up your Google Contacts by removing unwanted birthday
          notifications from old Facebook syncs and random contacts
        </p>
        <div className="flex justify-center gap-2 mb-8">
          <Badge variant="secondary" className="text-sm">
            <Gift className="h-3 w-3 mr-1" />
            Free to use
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Shield className="h-3 w-3 mr-1" />
            Privacy focused
          </Badge>
        </div>
      </div>

      {/* Motivation Section */}
      <Card className="mb-12 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Why you need this
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Remember when Facebook automatically synced all your contacts with
            their birthdays 15+ years ago? Now you're getting calendar
            notifications for hundreds of random people you barely know. This
            tool helps you clean up that mess by selectively removing birthday
            data from your Google Contacts.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>View Contacts</CardTitle>
            <CardDescription>
              See all your contacts that have birthday information with a clean,
              organized interface
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 rounded-lg bg-destructive/10 w-fit mb-4">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Remove Birthdays</CardTitle>
            <CardDescription>
              Selectively delete birthday data from specific contacts with just
              a few clicks
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Secure Access</CardTitle>
            <CardDescription>
              Uses Google OAuth for secure access to your contacts. No data
              stored on our servers.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Privacy Notice */}
      <Alert className="mb-8">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Notice:</strong> This app only accesses your Google
          Contacts to show and modify birthday information. No data is stored on
          our servers, and you can revoke access at any time from your Google
          Account settings.
        </AlertDescription>
      </Alert>

      <Separator className="my-8" />

      {/* Call to Action */}
      <div className="text-center">
        {authenticated ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <CheckCircle className="h-5 w-5" />
              You&apos;re already authenticated!
            </div>
            <Button size="xxl" variant="default" asChild>
              <Link href="/contacts">View Your Contacts</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ready to clean up your contacts? Connect your Google account to
                get started.
              </p>
              <form action={startOAuth}>
                <Button size="xxl" variant="default">
                  Connect Google Account
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This app requires access to your Google Contacts to function. You can
          revoke access at any time from your Google Account settings.
        </p>
      </div>
    </div>
  );
}
