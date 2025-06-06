import { Button } from "@/src/components/ui/button";
import { Wrapper } from "@/src/components/ui/wrapper";
import { HeadingLevel, VisuallyHidden } from "@ariakit/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/(authenticated)/_authenticated")({
  component: () => <RouteComponent />,
});

const RouteComponent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (
    <main className="relative min-h-screen flex p-8">
      <Wrapper className="max-w-5/6 flex gap-8">
        <div>
          <Button
            onClick={async () => {
              const res = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/logout`,
                {
                  method: "POST",
                  credentials: "include",
                }
              );

              if (res.ok) {
                await Promise.all([
                  queryClient.setQueryData(["currentUser"], null),
                  queryClient.invalidateQueries({
                    queryKey: ["currentUser"],
                  }),
                ]);
                navigate({ to: "/auth/login", replace: true });
              }
            }}
          >
            <LogOut className="rotate-180" />
            <VisuallyHidden>Déconnexion</VisuallyHidden>
          </Button>
        </div>
        <HeadingLevel>
          <Outlet />
        </HeadingLevel>
      </Wrapper>
    </main>
  );
};
