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
import { formatMemory } from "@/lib/utils";
import { UseQueryResult } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import type { components } from "schema";

export const Route = createFileRoute("/runners/stats")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    void queryClient.ensureQueryData(api.queryOptions("get", "/runners"));
  },
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
  const jobs = api.useQuery("get", "/jobs");
  const metrics = api.useQuery("get", "/metrics") as UseQueryResult<
    {
      runner: string;
      metrics: components["schemas"]["Metric"][];
    }[]
  >;

  const [selectedChart, setSelectedChart] =
    useState<components["schemas"]["RunnerState"]>("active");
  const [selectedMetricChart, setSelectedMetricChart] =
    useState<keyof components["schemas"]["Metric"]>("cpu");

  const SASMetricsData = useMemo(() => {
    if (!metrics.data || !jobs.data) return;

    const SAS = [
      ...new Set(
        jobs.data
          .map((job) => job.SAS)
          .filter((sas): sas is string => sas != null),
      ),
    ];

    return SAS.map((sas) => {
      const sasJobs = jobs.data.filter((job) => job.SAS === sas);
      const sasRunnerIds = sasJobs
        .map((job) => job.runner)
        .filter((id): id is string => id != null);

      // Filter out runners that are offline
      const activeRunnerIds = sasRunnerIds.filter((runnerId) => {
        const runner = runners.data?.find((r) => r.id === runnerId);
        return runner && runner.state !== "offline";
      });

      const sasRunnerMetrics = activeRunnerIds.reduce(
        (acc, runnerId) => {
          const runnerData = metrics.data.find((m) => m.runner === runnerId);
          if (!runnerData?.metrics.length) return acc;
          const metric = runnerData.metrics[0]!;

          return {
            cpu: Number(
              (Number(acc.cpu ?? 0) + Number(metric.cpu ?? 0)) /
                activeRunnerIds.length,
            ),
            memory:
              (Number(acc.memory ?? 0) + Number(metric.memory ?? 0)) /
              activeRunnerIds.length,
            network_receive:
              (Number(acc.network_receive ?? 0) +
                Number(metric.network_receive ?? 0)) /
              activeRunnerIds.length,
            network_transmit:
              (Number(acc.network_transmit ?? 0) +
                Number(metric.network_transmit ?? 0)) /
              activeRunnerIds.length,
            fs_reads:
              (Number(acc.fs_reads ?? 0) + Number(metric.fs_reads ?? 0)) /
              activeRunnerIds.length,
            fs_writes:
              (Number(acc.fs_writes ?? 0) + Number(metric.fs_writes ?? 0)) /
              activeRunnerIds.length,
          };
        },
        {} as components["schemas"]["Metric"],
      );

      if (Object.keys(sasRunnerMetrics).length === 0) {
        return;
      }

      return {
        sas: sas,
        ...sasRunnerMetrics,
      };
    })
      .filter((sas) => sas !== undefined)
      .sort((a, b) => {
        if (!a || !b) return 0;
        return b[selectedMetricChart]! - a[selectedMetricChart]!;
      });
  }, [metrics.data, selectedMetricChart]);
  console.log(SASMetricsData);

  const runnerData = useMemo(() => {
    if (!runners.data) return;
    return runnerStates
      .filter((state) => state !== "offline")
      .map((state) => ({
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

      return { active, failed, idle, offline, total };
    });
  }, [runners.data]);

  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Runner stats</h1>

      <div className="flex gap-4">
        <>
          <div className="flex-1">
            <div className="flex items-center">
              <h2 className="mb-3 text-xl font-semibold">Runners by state</h2>
              <Select
                value={selectedChart}
                onValueChange={(v: components["schemas"]["RunnerState"]) =>
                  setSelectedChart(v)
                }
              >
                <SelectTrigger className="mb-2 ml-auto">
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
            </div>
            {runnerDataTime ? (
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
            ) : (
              <div className="size-full max-h-80 animate-pulse rounded-md bg-gray-2" />
            )}
          </div>

          <div className="size-80">
            <h2 className="mb-3 text-xl font-semibold">Total runners</h2>

            {runnerData && runners.data ? (
              /* @ts-expect-error div in chart */
              <ChartContainer
                config={{} satisfies ChartConfig}
                className="relative aspect-square max-w-80"
              >
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center text-center">
                  <span className="text-4xl font-semibold">
                    {
                      runners.data.filter(
                        (runner) => runner.state !== "offline",
                      ).length
                    }
                  </span>
                  <span className="text-sm font-medium text-gray-11">
                    Runners
                  </span>
                </div>
                <PieChart accessibilityLayer data={runnerData}>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    strokeWidth={0}
                    data={runnerData}
                    innerRadius={90}
                    outerRadius={140}
                    dataKey="count"
                    nameKey="state"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="aspect-square max-w-80 animate-pulse rounded-md bg-gray-2" />
            )}
          </div>
        </>
      </div>

      <div className="pt-4">
        <div className="flex items-center">
          <h2 className="mb-3 text-xl font-semibold">Average metrics by SAS</h2>
          <Select
            value={selectedMetricChart}
            onValueChange={(v: keyof components["schemas"]["Metric"]) =>
              setSelectedMetricChart(v)
            }
          >
            <SelectTrigger className="mb-2 ml-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                [
                  "cpu",
                  "memory",
                  "network_receive",
                  "network_transmit",
                  "fs_reads",
                  "fs_writes",
                ] as (keyof components["schemas"]["Metric"])[]
              ).map((metric, i) => (
                <SelectItem key={i} value={metric}>
                  {metric}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {SASMetricsData ? (
          <ChartContainer
            config={{} satisfies ChartConfig}
            className="max-h-80 w-full"
          >
            {/* @ts-expect-error margin type */}
            <BarChart margin={0} accessibilityLayer data={SASMetricsData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <CartesianGrid strokeDasharray={2} vertical={false} />
              <XAxis
                className="hidden"
                interval={0}
                dataKey="sas"
                tickLine={false}
                axisLine={false}
                minTickGap={0}
              />
              <YAxis
                dataKey={selectedMetricChart}
                spacing={10}
                tickLine={false}
                tickMargin={20}
                axisLine={false}
              />

              <Bar
                dataKey={selectedMetricChart}
                stackId="a"
                fill="var(--blue-9)"
              >
                <LabelList
                  fontSize={8}
                  formatter={(v: number) =>
                    selectedMetricChart === "cpu" ? v : formatMemory(v)
                  }
                  dataKey={selectedMetricChart}
                  position="top"
                  offset={6}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="size-full max-h-80 animate-pulse rounded-md bg-gray-2" />
        )}
      </div>
    </div>
  );
}
