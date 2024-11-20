import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/runners/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const runner = api.useQuery("get", "/runners/{id}", {
    params: { path: { id } },
  });
  const metrics = api.useQuery("get", "/metrics/{id}", {
    params: { path: { id } },
  });
  return (
    <div>
      {runner.data && JSON.stringify(runner.data)}
      {metrics.data && JSON.stringify(metrics.data)}
    </div>
  );
}
