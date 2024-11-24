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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { formatMemory } from "@/lib/utils";
import {
  queryOptions,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownIcon,
  ArrowDownUpIcon,
  ArrowUpIcon,
  ChevronUp,
  CpuIcon,
  EyeIcon,
  HardDriveIcon,
  HardDriveUploadIcon,
  MemoryStickIcon,
  PenLineIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import { useState, type PropsWithChildren } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
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
  loader: async ({ params, context: { queryClient } }) => {
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

  const [selectedMetric, setSelectedMetric] = useState("cpu");

  return (
    <div>
      <span className="text-sm font-medium text-gray-11">Runner</span>
      <div className="flex items-center pb-4">
        {runner.data ? (
          <>
            <h1 className="mr-2 text-3xl font-semibold">{runner.data?.id}</h1>
            {runner.data && <RunnerStateBadge state={runner.data.state!} />}
          </>
        ) : (
          <div className="h-9 w-full animate-pulse rounded-md bg-gray-2" />
        )}
      </div>
      <div className="flex h-24 gap-x-4">
        {latestMetrics ? (
          <>
            <Metric icon={<CpuIcon />} title="CPU load">
              <div className="text-2xl font-semibold">
                {(latestMetrics.cpu! * 100).toFixed(0)}%
              </div>
            </Metric>
            <Metric icon={<MemoryStickIcon />} title="Memory used">
              <div className="text-2xl font-semibold">
                {formatMemory(latestMetrics.memory!)} / 4 GB
              </div>
            </Metric>
            <Metric icon={<ArrowDownUpIcon />} title="Network">
              <div className="flex items-center text-sm/none font-semibold">
                <ArrowUpIcon className="mr-2 size-4" />
                {formatMemory(latestMetrics.network_transmit!)}/s
              </div>
              <div className="flex items-center text-sm/none font-semibold">
                <ArrowDownIcon className="mr-2 size-4" />
                {formatMemory(latestMetrics.network_receive!)}/s
              </div>
            </Metric>
            <Metric icon={<HardDriveIcon />} title="Disk">
              <div className="flex items-center text-sm/none font-semibold">
                <EyeIcon className="mr-2 size-4" />
                {formatMemory(latestMetrics.fs_reads!)}/s
              </div>
              <div className="flex items-center text-sm/none font-semibold">
                <PenLineIcon className="mr-2 size-4" />
                {formatMemory(latestMetrics.fs_writes!)}/s
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

      <div className="grid grid-cols-2 gap-4 pt-6">
        <div>
          <h2 className="mr-2 pb-2 text-xl font-semibold">Metrics</h2>
          <div className="flex h-72 flex-col items-start justify-between">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Data</SelectLabel>
                  <SelectItem value="cpu">CPU load</SelectItem>
                  <SelectItem value="memory">Memory used</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="disk">Disk</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {metrics.data?.metrics ? (
              <Chart
                metrics={metrics.data.metrics}
                selectedMetric={selectedMetric}
              />
            ) : (
              <div className="h-60 w-full animate-pulse rounded-md bg-gray-2" />
            )}
          </div>
        </div>

        <div>
          <h2 className="mr-2 pb-2 text-xl font-semibold">Jobs</h2>
          {jobs.data ? (
            <div className="flex h-72 flex-col justify-between gap-y-4">
              {jobs.data.map((job) => {
                return (
                  <Card key={job.id} className="flex items-center p-4">
                    <JobStateDot className="mr-4" state={job.state!} />
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex flex-col">
                        <div className="text-base font-semibold">{job.SAS}</div>
                        <div className="text-xs font-medium text-gray-11">
                          {job.id}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-11">
                        {DateTime.fromISO(job.timestamp!).toRelative()}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="h-72 w-full animate-pulse rounded-md bg-gray-2" />
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
  selectedMetric: string;
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
      <AreaChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
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
              tickMargin={16}
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
              tickMargin={16}
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
              tickMargin={16}
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
              tickMargin={16}
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
