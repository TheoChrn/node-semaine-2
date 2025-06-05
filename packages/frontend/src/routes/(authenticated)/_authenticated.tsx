import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_authenticated")({
  beforeLoad: ({ context, location }) => {
    console.log("toto");
    if (!context.auth.user) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
