import { Wrapper } from "@/src/components/ui/wrapper";
import { HeadingLevel } from "@ariakit/react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/auth") {
      return redirect({ to: "/auth/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Wrapper>
        <HeadingLevel>
          <Outlet />
        </HeadingLevel>
      </Wrapper>
    </main>
  );
}
