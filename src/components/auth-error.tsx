"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  return (
    <Alert className="mb-8 border-destructive/50 bg-destructive/10 backdrop-blur-sm">
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
  );
}
