import { AuthError } from "@/components/auth-error";
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
import { Skeleton } from "@/components/ui/skeleton";
import { isAuthenticated, startOAuth } from "@/lib/actions";
import {
  Calendar,
  CheckCircle,
  Gift,
  Github,
  Info,
  Shield,
  Sparkles,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Google Contacts Birthday Manager - Remove Contact Birthdays",
  description:
    "Simple tool to remove birthday info from your Google Contacts. Useful for cleaning up old Facebook syncs.",
  keywords: [
    "Google Contacts cleanup",
    "birthday notifications",
    "Facebook sync removal",
    "contact management tool",
    "Google OAuth",
    "privacy-focused",
    "contact birthday manager",
  ],
  openGraph: {
    title: "Google Contacts Birthday Manager - Remove Contact Birthdays",
    description:
      "Simple tool to remove birthday info from your Google Contacts.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/api/og?title=Google%20Contacts%20Birthday%20Manager&description=Remove%20birthday%20info%20from%20contacts",
        width: 1200,
        height: 630,
        alt: "Google Contacts Birthday Manager - Remove contact birthdays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Contacts Birthday Manager - Remove Contact Birthdays",
    description:
      "Simple tool to remove birthday info from your Google Contacts.",
  },
  alternates: {
    canonical: "/",
  },
};

async function AuthCTA() {
  const authenticated = await isAuthenticated();

  return (
    <div className="text-center space-y-8">
      {authenticated ? (
        <div className="space-y-8">
          <div className="flex items-center justify-center gap-3 text-primary font-semibold text-lg">
            <div className="p-2 rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6" />
            </div>
            You&apos;re already authenticated!
          </div>
          <Button
            size="lg"
            asChild
            className="h-14 px-12 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <Link href="/contacts" className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              View Your Contacts
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-6">
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ready to clean up your contacts? Sign in with Google to get
              started.
            </p>
            <form action={startOAuth}>
              <Button
                size="lg"
                variant="default"
                className="h-14 px-12 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-primary-foreground/20">
                    <Calendar className="h-5 w-5" />
                  </div>
                  Sign in with Google
                </div>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthCTALoading() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-6">
        <Skeleton className="h-6 w-96 mx-auto" />
        <Skeleton className="h-14 w-64 mx-auto rounded-lg" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Suspense fallback={null}>
          <AuthError />
        </Suspense>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent animate-pulse"></div>
              <Calendar className="h-20 w-20 text-primary relative z-10" />
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Google Contacts
              <br />
              <span className="text-primary">Birthday Manager</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Remove birthday info from your Google Contacts. Useful for
              cleaning up old Facebook syncs and unwanted notifications.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <Gift className="h-4 w-4 mr-2" />
                Free
              </Badge>
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium bg-card/30 backdrop-blur-sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                No data stored
              </Badge>
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Easy to use
              </Badge>
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        <Card className="mb-16 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Info className="h-6 w-6 text-primary" />
              </div>
              Why this exists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Remember when Facebook synced all your contacts with birthdays
              years ago? Now you get calendar notifications for random people
              you barely know. This tool lets you remove birthday info from
              specific contacts so you only get notifications for people you
              actually care about.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">View Contacts</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                See all your contacts that have birthdays in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-destructive/10 transition-all duration-300 hover:-translate-y-1 border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trash2 className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl">Remove Birthdays</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Delete birthday info from contacts you don&apos;t want
                notifications for
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Google Login</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Uses Google sign-in to access your contacts. Nothing gets stored
                on our servers.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Privacy Notice */}
        <Alert className="mb-12 bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
          <Shield className="h-5 w-5" />
          <AlertDescription className="text-base">
            <strong>Privacy:</strong> This app only reads your contacts to show
            birthdays. Nothing gets saved on our servers. You can disconnect
            anytime in your Google settings.
          </AlertDescription>
        </Alert>

        <Separator className="my-12 bg-border/50" />

        {/* Call to Action */}
        <Suspense fallback={<AuthCTALoading />}>
          <AuthCTA />
        </Suspense>

        {/* Footer */}
        <div className="mt-20 text-center space-y-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-colors"
            >
              <a
                href="https://github.com/KATT/google-contact-delete-birthdays"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Source on GitHub
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            This app needs access to your Google Contacts to work. You can
            remove access anytime from your Google Account settings.
          </p>
        </div>
      </div>
    </div>
  );
}
