import { cn } from "@/lib/utils";
import { type components } from "schema";

type RunnerState = components["schemas"]["RunnerState"];

const dotVariants = {
  active: "bg-green-9",
  idle: "relative bg-yellow-9 after:absolute after:-left-0.5 after:-top-[1px] after:size-2 after:rounded-full after:bg-primary",
  failed: "bg-red-9",
  offline: "bg-gray-9",
} satisfies Record<RunnerState, string>;

export function RunnerStateDot({
  state,
  className,
}: {
  state: RunnerState;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "size-2.5 shrink-0 rounded-full",
        dotVariants[state],
        className,
      )}
    />
  );
}

const badgeVariants = {
  active: "border-green-7 bg-green-a3 text-green-9",
  idle: "border-yellow-7 bg-yellow-a3 text-yellow-9",
  failed: "border-red-7 bg-red-a3 text-red-9",
  offline: "border-gray-7 bg-gray-a3 text-gray-9",
} satisfies Record<RunnerState, string>;

export function RunnerStateBadge({ state }: { state: RunnerState }) {
  return (
    <div
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-3 text-xs font-semibold uppercase",
        badgeVariants[state],
      )}
    >
      <RunnerStateDot className="mr-1 size-1.5" state={state} />
      {state}
    </div>
  );
}
