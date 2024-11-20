import { type ReactNode } from "@tanstack/react-router";
import { type components } from "schema";

const variants = {
  active: <div className="size-2.5 shrink-0 rounded-full bg-green-9" />,
  idle: (
    <div className="bg-yellow-9 relative size-2.5 shrink-0 rounded-full after:absolute after:-left-0.5 after:-top-[1px] after:size-2 after:rounded-full after:bg-primary" />
  ),
  failed: <div className="bg-red-9 size-2.5 shrink-0 rounded-full" />,
  offline: <div className="size-2.5 shrink-0 rounded-full bg-gray-9" />,
} satisfies Record<components["schemas"]["RunnerState"], ReactNode>;

export function RunnerState({
  state,
}: {
  state: components["schemas"]["RunnerState"];
}) {
  return variants[state];
}
