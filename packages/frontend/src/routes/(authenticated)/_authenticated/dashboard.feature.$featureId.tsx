import { Button } from "@/src/components/ui/button";
import { Dialog } from "@/src/components/ui/dialog";
import { Heading, HeadingLevel, VisuallyHidden } from "@ariakit/react";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { Triangle } from "lucide-react";

const getFeature = (featureId: string) =>
  queryOptions({
    queryKey: ["getFeature", featureId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/features/${featureId}`, {
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
  "/(authenticated)/_authenticated/dashboard/feature/$featureId"
)({
  loader: ({ context: { queryClient, auth }, params: { featureId } }) => {
    queryClient.ensureQueryData(getFeature(featureId));
    return { user: auth };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { featureId } = Route.useParams();
  const { data: feature } = useSuspenseQuery(getFeature(featureId));
  const { user } = useLoaderData({
    from: "/(authenticated)/_authenticated/dashboard/feature/$featureId",
  });

  console.log(user);
  const { mutate } = useMutation({
    mutationFn: async (vote: { featureId: string; value: "up" | "down" }) => {
      await fetch(`/api/votes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vote),
      });
    },
    onMutate: async (vote) => {
      await queryClient.cancelQueries({
        queryKey: ["getFeature", vote.featureId],
      });

      const previousData = queryClient.getQueryData([
        "getFeature",
        vote.featureId,
      ]);

      queryClient.setQueryData(["getFeature", vote.featureId], (old: any) => {
        if (!old) return old;

        let newUp = old.votes.upCount;
        let newDown = old.votes.downCount;

        if (vote.value === "up") {
          if (old.votes.userValue === "down") newDown--;
          newUp++;
        } else {
          if (old.votes.userValue === "up") newUp--;
          newDown++;
        }

        return {
          ...old,
          votes: {
            ...old.votes,
            userValue: vote.value,
            upCount: newUp,
            downCount: newDown,
          },
        };
      });

      return { previousData };
    },
    onError: (_, vote, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["getFeature", vote.featureId],
          context.previousData
        );
      }
    },
    onSettled: (_, __, vote) => {
      queryClient.invalidateQueries({
        queryKey: ["getFeature", vote.featureId],
      });
    },
  });

  return (
    <Dialog onClose={() => navigate({ to: "/dashboard" })}>
      <HeadingLevel>
        <div className="flex gap-4 items-start">
          <div className="space-y-2">
            <Button
              disabled={feature.votes.userValue === "up"}
              variant="default"
              onClick={() => mutate({ featureId, value: "up" })}
            >
              <VisuallyHidden>Upvote</VisuallyHidden>
              <Triangle size={10} />
              {feature.votes.upCount}
            </Button>
            <Button
              disabled={feature.votes.userValue === "down"}
              variant="default"
              onClick={() => mutate({ featureId, value: "down" })}
            >
              <VisuallyHidden>Downvote</VisuallyHidden>
              <Triangle className="rotate-180" size={10} />
              {feature.votes.downCount}
            </Button>
          </div>
          <div>
            <Heading className="flex text-2xl font-semibold justify-between items-center">
              {feature.title}
            </Heading>
            <p>{feature.description}</p>
          </div>
        </div>
      </HeadingLevel>
    </Dialog>
  );
}
