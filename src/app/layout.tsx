import { ModeToggle } from "@/components/ui/mode-toggle";
import { NextThemeProvider } from "@/components/ui/theme-provider";
import { env } from "@/lib/env";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { WebApplication, WithContext } from "schema-dts";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Google Contacts Birthday Manager",
  description:
    "A simple tool to remove birthday info from your Google Contacts. Useful for cleaning up old Facebook syncs and unwanted birthday notifications.",
  keywords: [
    "Google Contacts",
    "Birthday Manager",
    "Contact Management",
    "Privacy",
    "Facebook Sync",
    "Calendar Cleanup",
  ],
  authors: [{ name: "Google Contacts Birthday Manager" }],
  creator: "Google Contacts Birthday Manager",
  applicationName: "Google Contacts Birthday Manager",
  generator: "Next.js",
  category: "productivity",
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  openGraph: {
    title: "Google Contacts Birthday Manager",
    description:
      "A simple tool to remove birthday info from your Google Contacts.",
    type: "website",
    locale: "en_US",
    siteName: "Google Contacts Birthday Manager",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Google Contacts Birthday Manager - Remove contact birthdays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Contacts Birthday Manager",
    description:
      "A simple tool to remove birthday info from your Google Contacts.",
    creator: "@GoogleContactsBirthdayManager",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  manifest: "/manifest.json",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
  },
};

const structuredData: WithContext<WebApplication> = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Google Contacts Birthday Manager",
  description:
    "A simple tool to remove birthday info from your Google Contacts. Useful for cleaning up old Facebook syncs.",
  url: env.NEXT_PUBLIC_BASE_URL,
  applicationCategory: "Utility",
  operatingSystem: "Web Browser",
  permissions: "https://www.googleapis.com/auth/contacts",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "View contacts with birthdays",
    "Remove birthday info from contacts",
    "Google account login",
    "No data stored on servers",
  ],
  provider: {
    "@type": "Organization",
    name: "Google Contacts Birthday Manager",
    url: env.NEXT_PUBLIC_BASE_URL,
  },
  creator: {
    "@type": "Organization",
    name: "Google Contacts Birthday Manager",
  },
  audience: {
    "@type": "Audience",
    audienceType: "People with Google Contacts",
  },
  inLanguage: "en-US",
  isAccessibleForFree: true,
  hasPart: [
    {
      "@type": "WebPage",
      name: "Home",
      url: env.NEXT_PUBLIC_BASE_URL,
      description: "Main page with login and app overview",
    },
    {
      "@type": "WebPage",
      name: "Contacts Management",
      url: `${env.NEXT_PUBLIC_BASE_URL}/contacts`,
      description: "Remove birthday info from your Google Contacts",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} font-sans antialiased bg-background text-foreground min-h-screen w-full selection:bg-primary/20 selection:text-primary-foreground flex flex-col`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 justify-end">
                  <Link
                    href="/docs/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/docs/toc"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="https://github.com/KATT/google-contact-delete-birthdays"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View Source Code
                  </Link>
                </div>
              </div>
            </div>
          </footer>

          <div className="fixed bottom-4 right-4 z-[9999]">
            <ModeToggle />
          </div>
        </NextThemeProvider>

        <GoogleAnalytics gaId="G-EB4554NYR8" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
