import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Google Contacts Birthday Manager",
    description:
      "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Google Contacts Birthday Manager",
    description:
      "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
