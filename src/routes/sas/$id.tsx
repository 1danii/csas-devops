import { JobStateDot } from "@/components/job-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartConfig,
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
import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCommitHorizontalIcon, GlobeIcon } from "lucide-react";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { components } from "schema";

export const Route = createFileRoute("/sas/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const jobs = api.useQuery("get", "/jobs", {
    // @ts-expect-error params
    params: { query: { SAS_eq: id } },
  });
  const metrics = api.useQuery("get", "/metrics") as UseQueryResult<
    {
      runner: string;
      metrics: components["schemas"]["Metric"][];
    }[]
  >;
  const [selectedMetricChart, setSelectedMetricChart] =
    useState<keyof components["schemas"]["Metric"]>("cpu");

  const jobMetricsData = useMemo(() => {
    if (!jobs.data || !metrics.data) return null;

    const data = jobs.data.map((job) => {
      const metric = metrics.data.find((m) => m.runner === job.runner);
      return { id: job.id, ...metric?.metrics[0] };
    });

    return data.sort(
      (a, b) => (b[selectedMetricChart] ?? 0) - (a[selectedMetricChart] ?? 0),
    );
  }, [metrics.data, jobs.data, selectedMetricChart]);
  console.log(jobMetricsData);

  return (
    <div>
      <div className="flex items-center pb-4">
        <div className="flex aspect-square size-20 items-center justify-center rounded-md border border-blue-6 bg-blue-2 p-3 text-blue-9">
          <GlobeIcon className="size-12" />
        </div>
        <div className="flex flex-col pl-4">
          <h1 className="mr-2 text-3xl font-semibold">{id}</h1>
        </div>
      </div>

      <div className="flex items-center">
        <h2 className="mb-3 text-xl font-semibold">Job by usage</h2>
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
      {jobMetricsData ? (
        <ChartContainer
          config={{} satisfies ChartConfig}
          className="max-h-80 w-full"
        >
          {/* @ts-expect-error margin type */}
          <BarChart margin={0} accessibilityLayer data={jobMetricsData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <CartesianGrid strokeDasharray={2} vertical={false} />
            <XAxis
              className="hidden"
              interval={0}
              dataKey="id"
              tickLine={false}
              axisLine={false}
              minTickGap={0}
            />
            <YAxis
              // tickFormatter={(v: number) =>
              //   selectedMetricChart === "cpu" ? v : formatMemory(Number(v))
              // }
              dataKey={selectedMetricChart}
              spacing={4}
              tickLine={false}
              // tickMargin={20}
              axisLine={false}
            />

            <Bar dataKey={selectedMetricChart} stackId="a" fill="var(--blue-9)">
              <LabelList
                fontSize={8}
                // formatter={(v: number) =>
                //   selectedMetricChart === "cpu" ? v : formatMemory(v)
                // }
                dataKey={selectedMetricChart}
                position="top"
                offset={6}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="h-80 w-full animate-pulse rounded-md bg-gray-2" />
      )}

      <div className="flex flex-col pt-4">
        <span className="pb-2 text-sm font-medium text-gray-11">
          Latest jobs
        </span>

        {jobs.data ? (
          <div className="flex flex-col gap-y-4">
            {jobs.data
              .sort(
                (a, b) =>
                  DateTime.fromISO(b.timestamp!).toMillis() -
                  DateTime.fromISO(a.timestamp!).toMillis(),
              )
              .map((job) => {
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
                      <div className="font</div>-medium ml-6 text-xs text-gray-11">
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
    </div>
  );
}
