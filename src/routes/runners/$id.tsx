import { JobStateDot } from "@/components/job-state";
import { RunnerStateBadge } from "@/components/runner-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { api } from "@/lib/api";
import { formatMemory } from "@/lib/utils";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  ArrowDownUpIcon,
  ArrowUpIcon,
  CpuIcon,
  EyeIcon,
  GitCommitHorizontalIcon,
  HardDriveIcon,
  MemoryStickIcon,
  PenLineIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { type PropsWithChildren } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { type components } from "schema";

const runnerQueryOptions = (id: string) =>
  api.queryOptions("get", "/runners/{id}", {
    params: { path: { id } },
  });
const runnerMetricsQueryOptions = (id: string) =>
  api.queryOptions("get", "/metrics/{id}", {
    params: { path: { id } },
  });
const runnerJobsQueryOptions = (id: string) =>
  api.queryOptions("get", "/jobs", {
    // @ts-expect-error query
    params: { query: { runner_eq: id } },
  });

export const Route = createFileRoute("/runners/$id")({
  component: RouteComponent,
  loader: ({ params, context: { queryClient } }) => {
    void queryClient.ensureQueryData(runnerQueryOptions(params.id));
    void queryClient.ensureQueryData(runnerMetricsQueryOptions(params.id));
    void queryClient.ensureQueryData(runnerJobsQueryOptions(params.id));
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const runner = useQuery(runnerQueryOptions(id));
  const metrics = useQuery(runnerMetricsQueryOptions(id)) as UseQueryResult<{
    runner: string;
    metrics: components["schemas"]["Metric"][];
  }>;
  const jobs = useQuery(runnerJobsQueryOptions(id));

  const latestMetrics = metrics.data?.metrics[0];

  return (
    <div>
      <span className="text-sm font-medium text-gray-11">Runner</span>
      <div className="pb-4">
        {runner.data ? (
          <>
            <div className="flex items-center">
              <h1 className="mr-2 text-3xl font-semibold">{runner.data?.id}</h1>
              <RunnerStateBadge state={runner.data.state!} />
            </div>
            <div className="text-sm text-gray-11">
              {runner.data.organization} / {runner.data.runner_group}
            </div>
          </>
        ) : (
          <>
            <div className="h-8 w-[580px] animate-pulse rounded-md bg-gray-2" />
            <div className="mt-2 h-4 w-52 animate-pulse rounded-md bg-gray-2" />
          </>
        )}
      </div>

      <div className="flex h-24 gap-x-4">
        {latestMetrics ? (
          <>
            <Metric icon={<CpuIcon />} title="CPU load">
              <div className="text-2xl font-semibold">
                {(Number(latestMetrics.cpu!) * 100).toFixed(0)}%
              </div>
            </Metric>
            <Metric icon={<MemoryStickIcon />} title="Memory used">
              <div className="text-2xl font-semibold">
                {formatMemory(Number(latestMetrics.memory!))} / 4 GB
              </div>
            </Metric>
            <Metric icon={<ArrowDownUpIcon />} title="Network">
              <div className="flex items-center text-sm/none font-semibold">
                <ArrowUpIcon className="mr-2 size-4" />
                {formatMemory(Number(latestMetrics.network_transmit!))}/s
              </div>
              <div className="flex items-center text-sm/none font-semibold">
                <ArrowDownIcon className="mr-2 size-4" />
                {formatMemory(Number(latestMetrics.network_receive!))}/s
              </div>
            </Metric>
            <Metric icon={<HardDriveIcon />} title="Disk">
              <div className="flex items-center text-sm/none font-semibold">
                <EyeIcon className="mr-2 size-4" />
                {formatMemory(Number(latestMetrics.fs_reads!))}/s
              </div>
              <div className="flex items-center text-sm/none font-semibold">
                <PenLineIcon className="mr-2 size-4" />
                {formatMemory(Number(latestMetrics.fs_writes!))}/s
              </div>
            </Metric>
          </>
        ) : (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded-md bg-gray-2"
              />
            ))}
          </>
        )}
      </div>

      <div className="flex flex-col pt-4">
        {jobs.data && jobs.data.length > 0 && (
          <span className="pb-2 text-sm font-medium text-gray-11">
            Assigned jobs
          </span>
        )}

        {jobs.data ? (
          <div className="flex flex-col gap-y-4">
            {jobs.data.map((job) => {
              return (
                <Card key={job.id} className="flex items-center p-4">
                  <JobStateDot className="mr-4" state={job.state!} />
                  <div className="flex flex-1 items-center">
                    <div className="flex flex-col">
                      <div className="text-base font-semibold">{job.SAS}</div>
                      <div className="text-xs font-medium text-gray-11">
                        {job.id}
                      </div>
                    </div>
                    <div className="ml-6 text-xs font-medium text-gray-11">
                      {DateTime.fromISO(job.timestamp!).toRelative()}
                    </div>
                    <div className="ml-48 flex flex-col">
                      <div className="text-xs font-medium text-gray-11">
                        Triggered by
                      </div>
                      <div className="flex items-center text-base font-medium">
                        <GitCommitHorizontalIcon className="mr-2 size-4 text-gray-11" />
                        p7v46705x
                      </div>
                    </div>

                    <Button className="ml-auto" asChild variant="outline">
                      <Link to="/jobs/$id" params={{ id: job.id! }}>
                        View details
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="h-[102px] w-full animate-pulse rounded-md bg-gray-2" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6">
        <div className="flex flex-col">
          <h2 className="mr-2 pb-2 text-xl font-semibold">CPU load</h2>
          {metrics.data?.metrics ? (
            <Chart metrics={metrics.data.metrics} selectedMetric="cpu" />
          ) : (
            <div className="h-60 w-full animate-pulse rounded-md bg-gray-2" />
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="mr-2 pb-2 text-xl font-semibold">Memory used</h2>
          {metrics.data?.metrics ? (
            <Chart metrics={metrics.data.metrics} selectedMetric="memory" />
          ) : (
            <div className="h-60 w-full animate-pulse rounded-md bg-gray-2" />
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="mr-2 pb-2 text-xl font-semibold">Network</h2>
          {metrics.data?.metrics ? (
            <Chart metrics={metrics.data.metrics} selectedMetric="network" />
          ) : (
            <div className="h-60 w-full animate-pulse rounded-md bg-gray-2" />
          )}
        </div>
        <div className="flex flex-col">
          <h2 className="mr-2 pb-2 text-xl font-semibold">Disk</h2>
          {metrics.data?.metrics ? (
            <Chart metrics={metrics.data.metrics} selectedMetric="disk" />
          ) : (
            <div className="h-60 w-full animate-pulse rounded-md bg-gray-2" />
          )}
        </div>
      </div>
    </div>
  );
}

function Metric(
  props: PropsWithChildren<{ icon: React.ReactNode; title: string }>,
) {
  return (
    <Card className="flex flex-1 items-center gap-x-4 p-4">
      <div className="aspect-square h-full rounded-md border border-blue-6 bg-blue-2 p-3 text-blue-9 *:size-full">
        {props.icon}
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-11">{props.title}</div>
        {props.children}
      </div>
    </Card>
  );
}

function Chart({
  metrics,
  selectedMetric,
}: {
  metrics: components["schemas"]["Metric"][];
  selectedMetric: "cpu" | "memory" | "network" | "disk";
}) {
  const chartData = metrics.map((metric) => ({
    cpu: Number(metric.cpu),
    memory: Number(metric.memory) / 4e9,
    fs_reads: Number(metric.fs_reads),
    fs_writes: Number(metric.fs_writes),
    network_receive: Number(metric.network_receive),
    network_transmit: Number(metric.network_transmit),
  }));

  return (
    <ChartContainer
      config={
        {
          cpu: {
            label: "CPU load",
          },
          memory: {
            label: "Memory used",
          },
        } satisfies ChartConfig
      }
      className="max-h-60 w-full"
    >
      {/* @ts-expect-error margin type */}
      <AreaChart margin={0} accessibilityLayer data={chartData}>
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

        {selectedMetric === "cpu" && (
          <>
            <YAxis
              dataKey="cpu"
              tickLine={false}
              tickMargin={20}
              axisLine={false}
              tickFormatter={(value) => (value * 100).toFixed(0) + "%"}
            />
            <Area dataKey="cpu" fill="var(--blue-a2)" stroke="var(--blue-a9)" />
          </>
        )}
        {selectedMetric === "memory" && (
          <>
            <YAxis
              dataKey="memory"
              tickLine={false}
              tickMargin={20}
              axisLine={false}
              tickFormatter={(value) => (value * 100).toFixed(0) + "%"}
            />
            <Area
              dataKey="memory"
              fill="var(--blue-a2)"
              stroke="var(--blue-a9)"
            />
          </>
        )}
        {selectedMetric === "network" && (
          <>
            <YAxis
              dataKey="fs_writes"
              tickLine={false}
              tickMargin={20}
              axisLine={false}
              tickFormatter={(value: number) => formatMemory(value)}
            />
            <Area
              dataKey="network_transmit"
              fill="var(--green-a2)"
              stroke="var(--green-a9)"
            />
            <Area
              dataKey="network_receive"
              fill="var(--blue-a2)"
              stroke="var(--blue-a9)"
            />
          </>
        )}
        {selectedMetric === "disk" && (
          <>
            <YAxis
              dataKey="fs_writes"
              tickLine={false}
              tickMargin={20}
              axisLine={false}
              tickFormatter={(value: number) => formatMemory(value)}
            />
            <Area
              dataKey="fs_reads"
              fill="var(--green-a2)"
              stroke="var(--green-a9)"
            />
            <Area
              dataKey="fs_writes"
              fill="var(--blue-a2)"
              stroke="var(--blue-a9)"
            />
          </>
        )}
      </AreaChart>
    </ChartContainer>
  );
}
