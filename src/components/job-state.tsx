import { cn } from "@/lib/utils";
import { CheckIcon, ClockIcon } from "lucide-react";
import { type components } from "schema";

type JobState = components["schemas"]["JobState"];

const dotVariants = {
  success: "bg-green-a6 text-green-9",
  in_progress:
    "bg-yellow-a6 text-yellow-9 border border-yellow-9 animate-spin border-dashed border-2",
  failed: "bg-red-a6 text-red-9",
  queued: "bg-blue-a6 text-blue-9",
} satisfies Record<JobState, string>;

export function JobStateDot({
  state,
  className,
}: {
  state: JobState;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative size-3.5 shrink-0 rounded-full p-0.5",
        dotVariants[state],
        className,
      )}
    >
      {state === "success" && (
        <CheckIcon strokeWidth={3} width="auto" height="auto" />
      )}
      {state === "failed" && (
        <svg
          width="auto"
          height="auto"
          viewBox="0 0 2 8"
          strokeWidth={2}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 4L1 1" stroke="currentColor" strokeLinecap="round" />
          <circle cx="1" cy="7" r="1" fill="currentColor" />
        </svg>
      )}
      {state === "queued" && (
        <ClockIcon strokeWidth={3} width="auto" height="auto" />
      )}
    </div>
  );
}

const badgeVariants = {
  success: "border-green-7 bg-green-a3 text-green-9",
  in_progress: "border-yellow-7 bg-yellow-a3 text-yellow-9",
  queued: "border-blue-7 bg-blue-a3 text-blue-9",
  failed: "border-red-7 bg-red-a3 text-red-9",
} satisfies Record<JobState, string>;

export function JobStateBadge({ state }: { state: JobState }) {
  return (
    <div
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-3 text-xs font-semibold uppercase",
        badgeVariants[state],
      )}
    >
      <JobStateDot className="mr-1 size-1.5" state={state} />
      {state}
    </div>
  );
}
