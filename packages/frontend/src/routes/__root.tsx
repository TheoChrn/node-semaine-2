import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { queryOptions, type QueryClient } from "@tanstack/react-query";
import type { AuthContext } from "@/src/auth";
import { ButtonLink } from "@/src/components/ui/button-link";

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.warn(
            "Authentication check failed on /api/users. Status:",
            res.status
          );
          return null;
        }

        const data = await res.json();

        return data.data;
      } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

export interface MyRouterContext {
  queryClient: QueryClient;
  auth: AuthContext | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(
      currentUserQueryOptions()
    );

    context.auth = user;

    const isAuthenticated = !!user;

    if (!isAuthenticated && !location.pathname.startsWith("/auth")) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
          replace: true,
        },
      });
    }
    if (isAuthenticated && location.pathname.startsWith("/auth")) {
      throw redirect({
        to: "/dashboard",
        search: {
          redirect: location.href,
          repalce: true,
        },
      });
    }

    return {
      auth: user as AuthContext["user"],
    };
  },
  loader: ({ context }) => {
    return { auth: context.auth };
  },
  component: () => {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
  errorComponent: () => {
    return (
      <div>
        <p>Something went wrong</p>
        <ButtonLink to="/">Start Over</ButtonLink>
      </div>
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
