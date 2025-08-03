"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleReauth, setBirthdays } from "@/lib/actions";
import type { people_v1 } from "googleapis";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Undo2,
  X,
} from "lucide-react";
import { useState, useTransition } from "react";

// Declare gtag function for TypeScript
declare global {
  function gtag(...args: unknown[]): void;
}

type State =
  | {
      type: "idle";
      etag: string;
    }
  | {
      type: "deleted";
      etag: string;
    }
  | {
      type: "error";
      etag: string;
      errorMessage: string;
      requiresReauth: boolean;
    };

export function DeleteButton(props: {
  resourceName: string;
  etag: string;
  birthdays: people_v1.Schema$Birthday[];
}) {
  const [state, setState] = useState<State>({
    type: "idle",
    etag: props.etag,
  });
  const [isPending, startTransition] = useTransition();

  const handleError = (error: string, needsReauth: boolean = false) => {
    setState({
      type: "error",
      etag: state.etag,
      errorMessage: error,
      requiresReauth: needsReauth,
    });
  };

  switch (state.type) {
    case "error":
      return (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1 px-2 py-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
          {state.requiresReauth && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                startTransition(async () => {
                  await handleReauth();
                });
              }}
              disabled={isPending}
              title={state.errorMessage}
              className="gap-1 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Sign In
                </>
              )}
            </Button>
          )}
        </div>
      );

    case "deleted":
      return (
        <div className="flex items-center gap-2 justify-end w-full">
          <Badge
            variant="secondary"
            className="gap-1 px-3 py-1 bg-primary/10 text-primary border-primary/20"
          >
            <CheckCircle className="h-3 w-3" />
            Cleared
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              startTransition(async () => {
                const result = await setBirthdays({
                  resourceName: props.resourceName,
                  birthdays: props.birthdays,
                  etag: state.etag,
                });

                if (result.success) {
                  setState({
                    type: "idle",
                    etag: result.etag!,
                  });

                  // Track undo clear event
                  if (typeof gtag !== "undefined") {
                    gtag("event", "undo_clear_birthday", {
                      event_category: "user_action",
                      event_label: "birthday_undo",
                    });
                  }
                } else {
                  handleError(result.error, result.requiresReauth);
                }
              });
            }}
            disabled={isPending}
            className="gap-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <Undo2 className="h-3 w-3" />
                Undo
              </>
            )}
          </Button>
        </div>
      );

    case "idle":
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={(event) => {
            {
              // Find the closest tr parent element
              const button = event.currentTarget as HTMLElement;

              if (button) {
                const tr = button.closest("tr");

                if (tr) {
                  const trHeight = tr.offsetHeight;

                  setTimeout(() => {
                    window.scrollBy({
                      top: trHeight,
                      behavior: "smooth",
                    });
                  }, 0);
                }
              }
            }
            startTransition(async () => {
              const result = await setBirthdays({
                resourceName: props.resourceName,
                birthdays: [],
                etag: state.etag,
              });

              if (result.success) {
                setState({
                  type: "deleted",
                  etag: result.etag!,
                });

                // Track birthday clear event
                if (typeof gtag !== "undefined") {
                  gtag("event", "clear_birthday", {
                    event_category: "user_action",
                    event_label: "birthday_cleared",
                  });
                }
              } else {
                handleError(result.error, result.requiresReauth);
              }
            });
          }}
          disabled={isPending}
          className="gap-1 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Clearing...
            </>
          ) : (
            <>
              <X className="h-3 w-3" />
              Clear Birthday
            </>
          )}
        </Button>
      );
    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = state;
      throw new Error(`Unhandled status: ${state}`);
  }
}
