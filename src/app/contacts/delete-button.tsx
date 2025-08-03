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
      needsReauth: boolean;
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

  const handleError = (options: { error: string; needsReauth: boolean }) => {
    setState({
      type: "error",
      etag: state.etag,
      errorMessage: options.error,
      needsReauth: options.needsReauth,
    });
  };

  // Fixed-width container to prevent layout shifts
  return (
    <div className="flex items-center justify-end w-[200px] min-h-[32px] ml-auto">
      {(() => {
        switch (state.type) {
          case "error":
            return (
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="gap-1 px-2 py-1">
                  <AlertCircle className="h-3 w-3" />
                  Error
                </Badge>
                {state.needsReauth && (
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
                    className="gap-1 shadow-sm hover:shadow-md transition-all duration-200 min-w-[80px]"
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
              <div className="flex items-center gap-2">
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
                        handleError({
                          error: result.error,
                          needsReauth: result.requiresReauth,
                        });
                      }
                    });
                  }}
                  disabled={isPending}
                  className="gap-1 shadow-sm hover:shadow-md transition-all duration-200 min-w-[70px]"
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
                    // Jump to the next row
                    const scrollHeight =
                      event.currentTarget.closest("tr")?.scrollHeight;
                    if (scrollHeight) {
                      setTimeout(() => {
                        window.scrollBy({
                          top: scrollHeight,
                          behavior: "smooth",
                        });
                      }, 0);
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
                      handleError({
                        error: result.error,
                        needsReauth: result.requiresReauth,
                      });
                    }
                  });
                }}
                disabled={isPending}
                className="gap-1 shadow-sm hover:shadow-md transition-all duration-200 min-w-[120px]"
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
      })()}
    </div>
  );
}
