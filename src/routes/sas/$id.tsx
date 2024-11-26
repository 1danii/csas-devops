import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sas/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <div>
      <span className="text-sm font-medium text-gray-11">SAS</span>
      <div className="pb-4">
        <h1 className="mr-2 text-3xl font-semibold">{id}</h1>
      </div>
    </div>
  );
}
