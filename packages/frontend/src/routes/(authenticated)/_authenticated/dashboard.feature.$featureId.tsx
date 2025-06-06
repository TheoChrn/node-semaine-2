import { Button } from "@/src/components/ui/button";
import { Dialog } from "@/src/components/ui/dialog";
import { ErrorMessage } from "@/src/components/ui/error-message";
import { Heading, HeadingLevel, VisuallyHidden } from "@ariakit/react";
import { createCommentSchema } from "@shared/validators";
import { useForm } from "@tanstack/react-form";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Triangle } from "lucide-react";

const getFeature = (featureId: string) =>
  queryOptions({
    queryKey: ["getFeature", featureId],
    queryFn: async (): Promise<Feature | null> => {
      try {
        const res = await fetch(`/api/features/${featureId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
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

      queryClient.setQueryData(
        ["getFeature", vote.featureId],
        (old: Feature) => {
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
        }
      );

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
  const { mutate: mutateComment, isPending: commentIsPending } = useMutation({
    mutationFn: async (comment: { featureId: string; content: string }) => {
      await fetch(`/api/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getFeature", featureId],
      });
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: ({ value }) => {
      mutateComment({ featureId, content: value.content });
    },
  });

  if (!feature) {
    navigate({ to: "/dashboard" });
    return;
  }

  return (
    <Dialog
      className="space-y-8"
      onClose={() => navigate({ to: "/dashboard" })}
    >
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            validators={{ onChange: createCommentSchema.shape.content }}
            name="content"
            children={(field) => {
              return (
                <>
                  <label className="block">
                    Commentaire
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      className="appearance-none min-h-20 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
        focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
        aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                  {field.state.meta.errors[0]?.message && (
                    <ErrorMessage
                      message={field.state.meta.errors[0].message}
                    />
                  )}
                </>
              );
            }}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!canSubmit || commentIsPending}
                  className="flex-1"
                >
                  {isSubmitting ? "..." : "Envoyer"}
                </Button>
              </div>
            )}
          />
        </form>
        {!!feature.comments && (
          <ul>
            {feature.comments.map((comment) => (
              <CommentItem comment={comment} />
            ))}
          </ul>
        )}
      </HeadingLevel>
    </Dialog>
  );
}

const CommentItem = ({ comment }: { comment: CommentWithChildren }) => {
  return (
    <div className="pl-4 not-first:pt-4  ">
      <div className="text-sm text-gray-800">
        <strong>{comment.user.email}</strong> –{" "}
        <span className="text-xs text-gray-500">
          {new Date(comment.createdAt).toLocaleString("fr-FR")}
        </span>
      </div>
      <p>{comment.content}</p>

      {comment.children && comment.children.length > 0 && (
        <div className="mt-2 pt-2 border-l">
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} />
          ))}
        </div>
      )}
    </div>
  );
};
