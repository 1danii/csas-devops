import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { data } = api.useQuery("get", "/runners");
  console.log(data);

  return (
    <div className="p-2">
      <h3 className="">Welcome Home!</h3>
      <Button variant="outline">Continue</Button>
      <Button variant="secondary">Continue</Button>
      <Button variant="link">Continue</Button>
      <Button>Continue</Button>
      <Button size="sm">Continue</Button>
      <Button size="lg">Continue</Button>
    </div>
  );
}
