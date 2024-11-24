import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { components } from "schema";

export const Route = createFileRoute("/jobs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="pb-4 text-3xl font-semibold">Jobs</h1>
    </div>
  );
}
