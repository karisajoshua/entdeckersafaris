import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tour-packages")({
  beforeLoad: () => {
    throw redirect({ to: "/safaris", statusCode: 301 });
  },
});
