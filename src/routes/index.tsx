import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button variant="outline">Continue</Button>
      <Button variant="secondary">Continue</Button>
      <Button variant="link">Continue</Button>
      <Button variant="ghost">Continue</Button>
      <Button>Continue</Button>
      <Button size="sm">Continue</Button>
      <Button size="lg">Continue</Button>
    </div>
  );
}
