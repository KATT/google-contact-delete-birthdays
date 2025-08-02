"use client";

import { Button } from "@/components/ui/button";
import { setBirthdays } from "@/lib/actions";
import type { people_v1 } from "googleapis";
import { Loader2, Undo2, X } from "lucide-react";
import { useState, useTransition } from "react";

type DeleteState = "idle" | "deleted";

export function DeleteButton(props: {
  resourceName: string;
  etag: string;
  birthdays: people_v1.Schema$Birthday[];
}) {
  const [state, setState] = useState<DeleteState>("idle");
  const [etag, setEtag] = useState(props.etag);
  const [isPending, startTransition] = useTransition();

  switch (state) {
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
                    alert("Failed to restore birthday. Please try again.");
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
                  alert("Failed to delete birthday. Please try again.");
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
