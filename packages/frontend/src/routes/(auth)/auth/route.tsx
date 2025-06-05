import { Wrapper } from "@/src/components/ui/wrapper";
import { HeadingLevel } from "@ariakit/react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/auth")({
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
