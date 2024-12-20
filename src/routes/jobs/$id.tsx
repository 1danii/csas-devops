import { JobStateBadge, JobStateDot } from "@/components/job-state";
import { RunnerStateDot } from "@/components/runner-state";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Background,
  Handle,
  type Node,
  type NodeProps,
  Position,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { GitCommitHorizontalIcon } from "lucide-react";
import { type DateObjectUnits, DateTime } from "luxon";
import { type CSSProperties, memo } from "react";
import { type components } from "schema";

export const Route = createFileRoute("/jobs/$id")({
  component: RouteComponent,
  loader: ({ context: { queryClient }, params: { id } }) => {
    void queryClient.ensureQueryData(jobQueryOptions(id));
  },
});

type JobNode = Node<{
  jobs: {
    name: string;
    state: components["schemas"]["JobState"];
    duration?: DateObjectUnits;
  }[];
}>;

const initialNodes: JobNode[] = [
  {
    id: "0",
    type: "custom",
    position: { x: 0, y: 0 },
    data: {
      jobs: [
        {
          name: "lint",
          state: "success",
          duration: { minute: 1, second: 32 },
        },
      ],
    },
  },
  {
    id: "1",
    type: "custom",
    position: { x: 400, y: 0 },
    data: {
      jobs: [
        {
          name: "tests-1",
          state: "success",
          duration: { minute: 2, second: 46 },
        },
        {
          name: "tests-2",
          state: "in_progress",
          duration: { minute: 5, second: 20 },
        },
      ],
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 800, y: 0 },
    data: {
      jobs: [
        {
          name: "deploy",
          state: "queued",
        },
      ],
    },
  },
];

const initialEdges = [
  { id: "e0-1", source: "0", target: "1", animated: true },
  { id: "e1-2", source: "1", target: "2", animated: true },
];

const CustomNode = memo(({ data, id }: NodeProps<JobNode>) => {
  return (
    <Card className="relative min-w-60 rounded-md px-4 py-2">
      <div className="flex flex-col gap-y-4">
        {data.jobs.map((job, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center">
              <JobStateDot state={job.state} />
              <span className="ml-4 text-sm font-semibold text-gray-12">
                {job.name}
              </span>
            </div>
            {job.duration && (
              <div className="text-xs font-medium text-gray-11">
                {DateTime.fromObject(job.duration).toFormat(
                  job.duration.hour
                    ? "h'h' m'm' ss's'"
                    : job.duration.minute
                      ? "m'm' ss's'"
                      : "ss's'",
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {Number(id) !== 0 && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="z-10 size-1.5 rounded-full !bg-gray-6 outline outline-4 outline-primary"
          />
          <div className="absolute left-0 top-1/2 -z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border !bg-primary" />
        </>
      )}
      {Number(id) !== initialNodes.length - 1 && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            className="z-10 size-1.5 rounded-full !bg-gray-6 outline outline-4 outline-primary"
          />
          <div className="absolute right-0 top-1/2 -z-10 size-4 -translate-y-1/2 translate-x-1/2 rounded-full border !bg-primary" />
        </>
      )}
    </Card>
  );
});

const nodeTypes = {
  custom: CustomNode,
};
const jobQueryOptions = (id: string) =>
  api.queryOptions("get", "/jobs/{id}", { params: { path: { id } } });

function RouteComponent() {
  const { theme } = useTheme();
  const { id } = Route.useParams();
  const job = useQuery(jobQueryOptions(id));
  const runner = api.useQuery(
    "get",
    "/runners/{id}",
    {
      // @ts-expect-error params
      params: { path: { id: job.data?.runner } },
    },
    { enabled: job.data?.runner === "none" ? false : true },
  );

  return (
    <div>
      <div>
        {job.data ? (
          <>
            <span className="pb-4 text-sm font-medium text-gray-11">Job</span>
            <div className="flex items-center">
              <h1 className="mr-2 text-3xl font-semibold">{job.data.id}</h1>
              <JobStateBadge state={job.data.state!} />
            </div>
            <div className="text-sm text-gray-11">{job.data.SAS}</div>
          </>
        ) : (
          <>
            <div className="h-8 w-[580px] animate-pulse rounded-md bg-gray-2" />
            <div className="mt-2 h-4 w-52 animate-pulse rounded-md bg-gray-2" />
          </>
        )}
      </div>

      <div className="flex flex-col pt-4">
        {!runner.isLoading ? (
          runner.data ? (
            <div className="pb-4">
              <span className="pb-2 text-sm font-medium text-gray-11">
                Assigned runner
              </span>
              <div className="flex flex-col gap-y-4">
                <Card key={runner.data.id} className="flex items-center p-4">
                  <RunnerStateDot className="mr-4" state={runner.data.state!} />
                  <div className="text-base font-semibold">
                    {runner.data.id}
                  </div>
                  <Button className="ml-auto" asChild variant="outline">
                    <Link to="/runners/$id" params={{ id: runner.data.id! }}>
                      View details
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          ) : null
        ) : (
          <div className="h-[102px] w-full animate-pulse rounded-md bg-gray-2" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="pb-2 text-sm font-medium text-gray-11">Details</span>
        {job.data ? (
          <Card className="flex items-center p-4">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-11">Start time</div>
              <div className="text-base font-medium">
                {DateTime.fromISO(job.data.timestamp!).toLocaleString(
                  DateTime.DATETIME_MED,
                )}
                <span className="text-gray-11">
                  {" "}
                  ({DateTime.fromISO(job.data.timestamp!).toRelative()})
                </span>
              </div>
            </div>
            <div className="ml-48 flex flex-col">
              <div className="text-xs font-medium text-gray-11">Tasks</div>
              <div className="flex items-center text-base font-medium">
                <span className="mr-2">2/4</span>
                <JobStateDot state={job.data.state!} />
              </div>
            </div>
            <div className="ml-24 flex flex-col">
              <div className="text-xs font-medium text-gray-11">
                Triggered by
              </div>
              <div className="flex items-center text-base font-medium">
                <GitCommitHorizontalIcon className="mr-2 size-4 text-gray-11" />
                p7v46705x
              </div>
            </div>
            <div className="ml-24 flex flex-col">
              <div className="text-xs font-medium text-gray-11">
                Organization
              </div>
              <div className="flex items-center text-base font-medium">
                {job.data.organization!}
              </div>
            </div>
            <div className="ml-auto flex flex-col">
              <div className="text-xs font-medium text-gray-11">
                Run history
              </div>
              <div className="flex items-center gap-x-0.5">
                {Array.from({ length: 30 }).map((_, i) => {
                  const failedIdx = [2, 3, 4, 5, 16];
                  return (
                    <div
                      key={i}
                      className={cn(
                        "h-6 w-1.5 rounded-sm",
                        failedIdx.includes(i) ? "bg-red-9" : "bg-green-9",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </Card>
        ) : (
          <div className="h-[74px] w-full animate-pulse rounded-md bg-gray-2" />
        )}
      </div>

      <div className="h-96 w-full pt-4">
        {job.data ? (
          <ReactFlow
            style={
              {
                "--xy-edge-stroke-default": "var(--slate-7)",
                "--xy-background-pattern-color-props": "var(--blue-9)",
              } as CSSProperties
            }
            proOptions={{ hideAttribution: true }}
            fitView
            fitViewOptions={{ padding: 0.4 }}
            className="rounded-xl border !bg-blue-2"
            nodeTypes={nodeTypes}
            nodes={initialNodes}
            edges={initialEdges}
            colorMode={theme}
          >
            <Background />
          </ReactFlow>
        ) : (
          <div className="h-96 w-full animate-pulse rounded-md bg-gray-2" />
        )}
      </div>
    </div>
  );
}
