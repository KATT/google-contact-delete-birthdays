import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Contacts Birthday Manager",
  description:
    "Clean up your Google Contacts by removing unwanted birthday notifications from old Facebook syncs and random contacts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased bg-background min-h-screen w-full`}
      >
        {children}
      </body>
    </html>
  );
}
