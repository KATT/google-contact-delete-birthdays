"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { handleReauth, setBirthdays } from "@/lib/actions";
import { people_v1 } from "googleapis";
import {
  AlertCircle,
  Cake,
  Calendar,
  CheckCircle,
  Edit3,
  Loader2,
  RefreshCw,
  Undo2,
  User,
  X,
} from "lucide-react";
import { useId, useState, useTransition } from "react";

// Declare gtag function for TypeScript
declare global {
  function gtag(...args: unknown[]): void;
}

type State =
  | { type: "idle"; etag: string }
  | { type: "deleted"; etag: string }
  | { type: "error"; etag: string; errorMessage: string; needsReauth: boolean };

interface ContactTableRowProps {
  contact: {
    resourceName: string;
    etag: string;
    displayName: string;
    birthdays?: people_v1.Schema$Birthday[];
  };
  index: number;
}

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export function ContactTableRow({ contact, index }: ContactTableRowProps) {
  // Separate transitions for different operations
  const [isPending, startTransition] = useTransition();
  const [isDialogPending, startDialogTransition] = useTransition();

  // Component state
  const [state, setState] = useState<State>({
    type: "idle",
    etag: contact.etag,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Track current birthdays - initialized from props, updated on operations
  const [currentBirthdays, setCurrentBirthdays] = useState<
    people_v1.Schema$Birthday[]
  >(contact.birthdays || []);

  // Track the last cleared birthday for undo functionality
  const [lastKnownBirthdays, setLastKnownBirthdays] = useState<
    people_v1.Schema$Birthday[]
  >(contact.birthdays || []);

  // Use the current birthdays state
  const hasBirthday = currentBirthdays.length > 0;

  const handleError = (error: string, needsReauth: boolean) => {
    setState({
      type: "error",
      etag: state.etag,
      errorMessage: error,
      needsReauth,
    });
  };

  const formId = useId();

  const formatBirthdayDisplay = (birthdays: people_v1.Schema$Birthday[]) => {
    return birthdays
      .filter((it) => !!it.date)
      .map((it) => {
        const date = it.date!;
        const year = date.year ?? "????";
        const month = date.month?.toString().padStart(2, "0") ?? "??";
        const day = date.day?.toString().padStart(2, "0") ?? "??";
        return `${year}-${month}-${day}`;
      })
      .join(", ");
  };

  return (
    <TableRow
      className={`transition-colors hover:bg-primary/5 ${
        index % 2 === 0 ? "bg-card" : "bg-muted/10"
      }`}
    >
      <TableCell className="font-medium py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground">{contact.displayName}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        {hasBirthday ? (
          <div className="font-mono text-sm bg-muted/30 px-3 py-1 rounded-md inline-block">
            {formatBirthdayDisplay(currentBirthdays)}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">No birthday set</span>
        )}
      </TableCell>
      <TableCell className="text-right py-4">
        <div className="flex items-center justify-end ml-auto">
          {state.type === "error" && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="gap-1 px-2 py-1">
                <AlertCircle className="h-3 w-3" />
                Error
              </Badge>
              {state.type === "error" && state.needsReauth && (
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
          )}

          {state.type === "deleted" && (
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
                      resourceName: contact.resourceName,
                      birthdays: lastKnownBirthdays,
                      etag: state.etag,
                    });

                    if (result.success) {
                      setState({ type: "idle", etag: result.etag! });
                      setCurrentBirthdays(lastKnownBirthdays);
                    } else {
                      handleError(result.error, result.requiresReauth);
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
          )}

          {state.type === "idle" && (
            <div className="flex items-center gap-2">
              {hasBirthday ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      const trHeight =
                        event.currentTarget.closest("tr")?.clientHeight;

                      if (trHeight) {
                        setTimeout(() => {
                          window.scrollBy({
                            top: trHeight,
                            behavior: "smooth",
                          });
                        }, 0);
                      }
                      startTransition(async () => {
                        // Store the current birthday before clearing
                        const birthdayToStore = currentBirthdays;

                        const result = await setBirthdays({
                          resourceName: contact.resourceName,
                          birthdays: [],
                          etag: state.etag,
                        });

                        if (result.success) {
                          setState({ type: "deleted", etag: result.etag! });
                          setCurrentBirthdays([]);
                          setLastKnownBirthdays(birthdayToStore);

                          // Track event
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
                        Clear
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                >
                  Add Birthday
                </Button>
              )}
            </div>
          )}
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(newOpen) => {
            setDialogOpen(newOpen);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Cake className="h-5 w-5 text-primary" />
                </div>
                {hasBirthday ? "Edit Birthday" : "Add Birthday"}
              </DialogTitle>
              <DialogDescription>
                {hasBirthday ? "Update" : "Add"} birthday information for{" "}
                {contact.displayName}
              </DialogDescription>
            </DialogHeader>

            <form
              className="grid gap-4 py-4"
              id={formId}
              action={async (formData) => {
                startDialogTransition(async () => {
                  const dayValue = formData.get("day") as string | null;
                  const monthValue = formData.get("month") as string | null;
                  const yearValue = formData.get("year") as string | null;
                  setDialogOpen(false);

                  // Validate required fields
                  if (!dayValue || !monthValue) {
                    handleError("Day and month are required", false);
                    return;
                  }

                  const date: people_v1.Schema$Date = {};
                  if (yearValue) {
                    date.year = parseInt(yearValue);
                  }
                  if (monthValue) {
                    date.month = parseInt(monthValue);
                  }
                  if (dayValue) {
                    date.day = parseInt(dayValue);
                  }
                  const birthday: people_v1.Schema$Birthday = {
                    date: date,
                  };

                  const result = await setBirthdays({
                    resourceName: contact.resourceName,
                    birthdays: [birthday],
                    etag: state.etag,
                  });

                  if (result.success) {
                    setState({ type: "idle", etag: result.etag! });
                    setCurrentBirthdays([birthday]);
                    setLastKnownBirthdays([birthday]);
                  } else {
                    handleError(result.error, result.requiresReauth);
                  }
                });
              }}
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Day
                  </label>
                  <Input
                    name="day"
                    type="number"
                    placeholder="Day"
                    min="1"
                    max="31"
                    className="text-center"
                    defaultValue={
                      currentBirthdays[0]?.date?.day?.toString() || ""
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Month
                  </label>
                  <Select
                    name="month"
                    defaultValue={
                      currentBirthdays[0]?.date?.month?.toString() || "1"
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((monthItem) => (
                        <SelectItem
                          key={monthItem.value}
                          value={monthItem.value}
                        >
                          {monthItem.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    name="year"
                    type="number"
                    placeholder="Year"
                    defaultValue={
                      currentBirthdays[0]?.date?.year?.toString() || ""
                    }
                    min="1900"
                    max="2030"
                    className="text-center"
                  />
                </div>
              </div>
            </form>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isDialogPending}
              >
                Cancel
              </Button>
              <Button
                form={formId}
                type="submit"
                disabled={isDialogPending}
                className="gap-2"
                onClick={() => setDialogOpen(false)}
              >
                {isDialogPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    {hasBirthday ? "Save Changes" : "Add Birthday"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
