import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Back Button */}
        <div className="mb-8">
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
        </div>

        {/* Content */}
        <main className="prose prose-neutral dark:prose-invert max-w-none">
          {props.children}
        </main>
      </div>
    </div>
  );
}
