import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { type components } from "schema";

export const Route = createFileRoute("/jobs/stats")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) => {
    void queryClient.ensureQueryData(api.queryOptions("get", "/jobs"));
  },
});

const jobStates: components["schemas"]["JobState"][] = [
  "success",
  "in_progress",
  "failed",
  "queued",
];

const stateColors: Record<components["schemas"]["JobState"], string> = {
  success: "var(--green-9)",
  in_progress: "var(--amber-9)",
  failed: "var(--red-9)",
  queued: "var(--blue-9)",
};

function RouteComponent() {
  const jobs = api.useQuery("get", "/jobs");

  const jobData = useMemo(() => {
    if (!jobs.data) return;
    return jobStates.map((state) => ({
      count: jobs.data?.filter((job) => job.state === state).length ?? 0,
      state: state,
      fill: stateColors[state],
    }));
  }, [jobs.data]);

  const jobDataBySAS = useMemo(() => {
    if (!jobs.data) return;
    const SAS = [
      ...new Set(
        jobs.data
          .map((job) => job.SAS)
          .filter((sas): sas is string => sas != null),
      ),
    ];

    return SAS.map((sas) => {
      const sasJobs = jobs.data.filter((job) => job.SAS === sas);
      return {
        sas: sas,
        success: sasJobs.filter((job) => job.state === "success").length,
        in_progress: sasJobs.filter((job) => job.state === "in_progress")
          .length,
        failed: sasJobs.filter((job) => job.state === "failed").length,
        queued: sasJobs.filter((job) => job.state === "queued").length,
        count: sasJobs.length,
      };
    });
  }, [jobs.data]);

  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Job metrics</h1>
      <div className="flex gap-4">
        <div className="flex-1">
          <h2 className="mb-3 text-xl font-semibold">Jobs by SAS</h2>
          {jobDataBySAS ? (
            <ChartContainer
              config={{} satisfies ChartConfig}
              className="max-h-80 w-full"
            >
              {/* @ts-expect-error margin type */}
              <BarChart margin={0} accessibilityLayer data={jobDataBySAS}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <CartesianGrid strokeDasharray={2} vertical={false} />
                <XAxis
                  interval={0}
                  dataKey="sas"
                  fontSize={6}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={0}
                />
                <YAxis
                  dataKey="count"
                  spacing={10}
                  tickLine={false}
                  tickMargin={20}
                  axisLine={false}
                />

                {jobStates.map((state, i) => {
                  return (
                    <Bar dataKey={state} stackId="a" fill={stateColors[state]}>
                      {i === jobStates.length - 1 && (
                        <LabelList
                          dataKey="count"
                          position="top"
                          offset={6}
                          fontSize={12}
                        />
                      )}
                    </Bar>
                  );
                })}
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="size-full max-h-80 animate-pulse rounded-md bg-gray-2" />
          )}
        </div>

        <div className="flex gap-4">
          <>
            <div className="size-80">
              <h2 className="mb-3 text-xl font-semibold">Total jobs</h2>

              {jobData && jobs.data ? (
                /* @ts-expect-error div in chart */
                <ChartContainer
                  config={{} satisfies ChartConfig}
                  className="relative aspect-square max-w-80"
                >
                  <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center text-center">
                    <span className="text-4xl font-semibold">
                      {jobs.data.length}
                    </span>
                    <span className="text-sm font-medium text-gray-11">
                      Jobs
                    </span>
                  </div>
                  <PieChart accessibilityLayer data={jobData}>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      strokeWidth={0}
                      data={jobData}
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
      </div>
    </div>
  );
}
