import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playlist/add")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/playlist/add"!</div>;
}
