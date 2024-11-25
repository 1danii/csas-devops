import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import type { components } from "schema";

export const Route = createFileRoute("/runners/stats")({
  component: RouteComponent,
});

const runnerStates: components["schemas"]["RunnerState"][] = [
  "active",
  "idle",
  "failed",
  "offline",
];

const stateColors: Record<components["schemas"]["RunnerState"], string> = {
  active: "var(--green-9)",
  failed: "var(--red-9)",
  idle: "var(--amber-9)",
  offline: "var(--slate-3)",
};

function RouteComponent() {
  const runners = api.useQuery("get", "/runners");
  const [selectedChart, setSelectedChart] =
    useState<components["schemas"]["RunnerState"]>("active");

  const runnerData = useMemo(() => {
    if (!runners.data) return;
    return runnerStates.map((state) => ({
      count:
        runners.data?.filter((runner) => runner.state === state).length ?? 0,
      state: state,
      fill: stateColors[state],
    }));
  }, [runners.data]);

  const runnerDataTime = useMemo(() => {
    if (!runners.data) return;
    const baseData = {
      active:
        runners.data.filter((runner) => runner.state === "active").length ?? 0,
      failed:
        runners.data.filter((runner) => runner.state === "failed").length ?? 0,
      idle:
        runners.data.filter((runner) => runner.state === "idle").length ?? 0,
      offline:
        runners.data.filter((runner) => runner.state === "offline").length ?? 0,
    };

    return Array.from({ length: 30 }).map((_, i) => {
      if (i === 30 - 1) return baseData;

      const variation = () => Math.floor(Math.random() * 21) - 10; // -10 to +10
      const active = Math.max(0, baseData.active + variation());
      const failed = Math.max(0, baseData.failed + variation());
      const idle = Math.max(0, baseData.idle + variation());
      const total = runners.data.length;
      const offline = total - (active + failed + idle);
      // Adjust offline to maintain total

      return { active, failed, idle, offline, total };
    });
  }, [runners.data]);

  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Runner stats</h1>

      <div className="flex gap-4">
        {runnerData && (
          <>
            <div className="flex-1">
              <Select
                value={selectedChart}
                onValueChange={(v: components["schemas"]["RunnerState"]) =>
                  setSelectedChart(v)
                }
              >
                <SelectTrigger className="mb-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {runnerStates.map((state, i) => (
                    <SelectItem key={i} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ChartContainer
                config={{} satisfies ChartConfig}
                className="max-h-80 w-full"
              >
                {/* @ts-expect-error margin type */}
                <AreaChart margin={0} accessibilityLayer data={runnerDataTime}>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <CartesianGrid strokeDasharray={2} vertical={false} />
                  <XAxis
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    minTickGap={0}
                    tickFormatter={(value) => {
                      if (value % 4 === 0) {
                        return `${10 + Number(value) / 4}:00`;
                      } else {
                        return "";
                      }
                    }}
                  />
                  <YAxis
                    dataKey={selectedChart}
                    spacing={10}
                    tickLine={false}
                    tickMargin={20}
                    axisLine={false}
                  />
                  {selectedChart === "active" && (
                    <Area
                      dataKey="active"
                      fill="var(--green-a2)"
                      stroke="var(--green-a9)"
                    />
                  )}
                  {selectedChart === "idle" && (
                    <Area
                      dataKey="idle"
                      fill="var(--amber-a2)"
                      stroke="var(--amber-a9)"
                    />
                  )}
                  {selectedChart === "failed" && (
                    <Area
                      dataKey="failed"
                      fill="var(--red-a2)"
                      stroke="var(--red-a9)"
                    />
                  )}
                  {selectedChart === "offline" && (
                    <Area
                      dataKey="offline"
                      fill="var(--slate-a2)"
                      stroke="var(--slate-a9)"
                    />
                  )}
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="size-80">
              <h2 className="mb-2 text-xl font-semibold">Total runners</h2>

              {/* @ts-expect-error div in chart */}
              <ChartContainer
                config={{} satisfies ChartConfig}
                className="relative aspect-square max-w-80"
              >
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center text-center">
                  <span className="text-4xl font-semibold">
                    {runners.data?.length}
                  </span>
                  <span className="text-sm font-medium text-gray-11">
                    Runners
                  </span>
                </div>
                <PieChart accessibilityLayer data={runnerData}>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={runnerData}
                    innerRadius={90}
                    outerRadius={140}
                    dataKey="count"
                    nameKey="state"
                  />
                </PieChart>
              </ChartContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
