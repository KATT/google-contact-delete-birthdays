"use client";

import { Button } from "@/components/ui/button";
import { handleReauth, setBirthdays } from "@/lib/actions";
import type { people_v1 } from "googleapis";
import { AlertTriangle, Loader2, RefreshCw, Undo2, X } from "lucide-react";
import { useState, useTransition } from "react";

type DeleteState = "idle" | "deleted" | "error";

export function DeleteButton(props: {
  resourceName: string;
  etag: string;
  birthdays: people_v1.Schema$Birthday[];
}) {
  const [state, setState] = useState<DeleteState>("idle");
  const [etag, setEtag] = useState(props.etag);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [requiresReauth, setRequiresReauth] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleError = (error: string, needsReauth: boolean = false) => {
    setErrorMessage(error);
    setRequiresReauth(needsReauth);
    setState("error");
  };

  switch (state) {
    case "error":
      return (
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Error
          </span>
          {requiresReauth ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                startTransition(async () => {
                  await handleReauth();
                });
              }}
              disabled={isPending}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title={errorMessage}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sign In
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState("idle")}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              title={errorMessage}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
        </div>
      );

    case "deleted":
      return (
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-sm font-medium">✅ Cleared</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startTransition(async () => {
                const result = await setBirthdays({
                  resourceName: props.resourceName,
                  birthdays: props.birthdays,
                  etag,
                });
                startTransition(() => {
                  if (result.success) {
                    setState("idle");
                    setEtag(result.etag!);
                  } else {
                    handleError(result.error, result.requiresReauth);
                  }
                });
              });
            }}
            disabled={isPending}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Undo2 className="h-4 w-4 mr-1" />
                Undo
              </>
            )}
          </Button>
        </div>
      );

    case "idle":
    default:
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            startTransition(async () => {
              const result = await setBirthdays({
                resourceName: props.resourceName,
                birthdays: [],
                etag,
              });
              startTransition(() => {
                if (result.success) {
                  setState("deleted");
                  setEtag(result.etag!);
                } else {
                  handleError(result.error, result.requiresReauth);
                }
              });
            });
          }}
          disabled={isPending}
          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <X className="h-4 w-4 mr-2" />
          )}
          {isPending ? "Clearing..." : "Clear Birthday"}
        </Button>
      );
  }
}
