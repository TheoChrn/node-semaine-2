import { Button } from "@/src/components/ui/button";
import { ButtonLink } from "@/src/components/ui/button-link";
import { Heading, HeadingLevel } from "@ariakit/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useLoaderData,
} from "@tanstack/react-router";
import { ChevronDown, ChevronUp, MessagesSquare, Plus } from "lucide-react";

const geAllFeaturesQueryOptions = () =>
  queryOptions({
    queryKey: ["getAllFeatures"],
    queryFn: async (): Promise<Features | null> => {
      try {
        const res = await fetch("/api/features", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          console.warn(
            "Authentication check failed on /api/features. Status:",
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

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/dashboard"
)({
  loader: ({ context: { queryClient, auth } }) => {
    queryClient.ensureQueryData(geAllFeaturesQueryOptions());
    return { user: auth };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useLoaderData({
    from: "/(authenticated)/_authenticated/dashboard",
  });

  const { data } = useSuspenseQuery(geAllFeaturesQueryOptions());

  if (!data || Object.values(data).every((arr) => arr.length === 0)) {
    return (
      <div>
        {user.role === "admin" ? (
          <>
            <span>Aucune feature n'a été publié</span>
            <Button>Ajouter</Button>
          </>
        ) : (
          "Aucune feature n'a été publié, attendé qu'un administrateur en publie une."
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Heading>See all the current features</Heading>
          {user.role === "admin" && (
            <ButtonLink variant="default" to="/dashboard/add-feature">
              Ajouer <Plus />
            </ButtonLink>
          )}
        </div>
        <HeadingLevel>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <ul
                key={key}
                className="space-y-3 p-4 border-border shadow bg-secondary rounded-lg"
              >
                <Heading className="text-2xl font-bold text-center capitalize">
                  {key}
                </Heading>

                <HeadingLevel>
                  {value.map((feature) => (
                    <Link
                      key={feature.id}
                      to={"/dashboard/feature/$featureId"}
                      params={{
                        featureId: feature.id,
                      }}
                      className="block bg-background hover:bg-secondary/50 duration-200"
                    >
                      <article className="flex-1 space-y-2  border border-border p-4  rounded-lg shadow">
                        <Heading className="text-xl  font-semibold">
                          {feature.title}
                        </Heading>

                        <div className="flex items-center gap-3">
                          <p className="line-clamp-1 flex-2/3 truncate">
                            {feature.description}
                          </p>
                          <div className="flex flex-auto items-center justify-between ">
                            <div className="flex items-center gap-1">
                              {feature.votes.upCount}
                              <ChevronUp size={16} className="text-green-600" />
                            </div>
                            <div className="flex items-center gap-1">
                              {feature.votes.downCount}
                              <ChevronDown size={16} className="text-red-600" />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-2 -right-2  size-4 rounded-full content-center text-center  text-xs  text-secondary bg-black">
                                {feature.commentCount}
                              </div>
                              <MessagesSquare size={16} />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </HeadingLevel>
              </ul>
            ))}
          </div>
        </HeadingLevel>
      </div>
      <Outlet />
    </>
  );
}
