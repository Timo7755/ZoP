import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/video-vsebine")({
  head: () => ({
    meta: [{ title: "Zgodbe o Pomurju — Video vsebine" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/video-vsebine"!</div>;
}
