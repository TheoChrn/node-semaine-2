import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_authenticated/truc")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(authenticated)/_authenticated/test"!</div>;
}
