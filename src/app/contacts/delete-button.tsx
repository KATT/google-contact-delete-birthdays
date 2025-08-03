"use client";

import { Button } from "@/components/ui/button";
import { handleReauth, setBirthdays } from "@/lib/actions";
import type { people_v1 } from "googleapis";
import { AlertTriangle, Loader2, RefreshCw, Undo2, X } from "lucide-react";
import { useState, useTransition } from "react";

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
          <span className="text-destructive text-sm font-medium">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Error
          </span>
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
          )}
        </div>
      );

    case "deleted":
      return (
        <div className="flex items-center gap-2 justify-end w-full">
          <span className="text-primary text-sm font-medium">✅ Cleared</span>
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
                } else {
                  handleError(result.error, result.requiresReauth);
                }
              });
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Undo2 />
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
              } else {
                handleError(result.error, result.requiresReauth);
              }
            });
          }}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <X />}
          {isPending ? "Clearing..." : "Clear Birthday"}
        </Button>
      );
    default:
      const _exhaustiveCheck: never = state;
      throw new Error(`Unhandled status: ${state}`);
  }
}
