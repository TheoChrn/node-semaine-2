import { ButtonLink } from "@/src/ui/button-link";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import type { AuthContext } from "@/src/auth";

export interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return (
      <>
        <header className="p-2 flex gap-2">
          <ButtonLink to="/" className="[&.active]:font-bold">
            Home
          </ButtonLink>
          <ButtonLink to="/about" className="[&.active]:font-bold">
            About
          </ButtonLink>
        </header>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <ButtonLink to="/">Start Over</ButtonLink>
      </div>
    );
  },
});
