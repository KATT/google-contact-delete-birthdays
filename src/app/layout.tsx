import { ModeToggle } from "@/components/ui/mode-toggle";
import { NextThemeProvider } from "@/components/ui/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts. Free, secure, and privacy-focused.",
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Google Contacts Birthday Manager",
    description:
      "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts.",
    type: "website",
    locale: "en_US",
    siteName: "Google Contacts Birthday Manager",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Google Contacts Birthday Manager - Clean up your contact birthdays",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Contacts Birthday Manager",
    description:
      "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts.",
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
    "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts. Free, secure, and privacy-focused.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  permissions: "https://www.googleapis.com/auth/contacts",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "View Google Contacts with birthdays",
    "Remove birthday information selectively",
    "Secure Google OAuth authentication",
    "Privacy-focused design",
    "No data storage on servers",
  ],
  provider: {
    "@type": "Organization",
    name: "Google Contacts Birthday Manager",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
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
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      description:
        "Main landing page with authentication and features overview",
    },
    {
      "@type": "WebPage",
      name: "Contacts Management",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/contacts`,
      description:
        "Manage and remove birthday information from Google Contacts",
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
        className={`${inter.className} font-sans antialiased bg-background text-foreground min-h-screen w-full selection:bg-primary/20 selection:text-primary-foreground`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative">{children}</main>

          {/* Development Mode Toggle - Fixed Position */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 right-4 z-[9999]">
              <ModeToggle />
            </div>
          )}
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
