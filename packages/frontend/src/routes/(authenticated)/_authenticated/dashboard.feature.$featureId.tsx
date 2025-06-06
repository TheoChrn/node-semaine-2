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
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from "@tanstack/react-router";
import { Pen, Reply, Trash, Triangle } from "lucide-react";
import { useRef, useState } from "react";

const getFeature = (featureId: string) =>
  queryOptions({
    queryKey: ["getFeature", featureId],
    queryFn: async (): Promise<Feature | null> => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/features/${featureId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          return null;
        }

        const data = await res.json();

        return data.data;
      } catch (err) {
        console.warn(err);
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

  const { mutate } = useMutation({
    mutationFn: async (vote: { featureId: string; value: "up" | "down" }) => {
      await fetch(`${import.meta.env.VITE_API_URL}/votes`, {
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
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["getFeature", vote.featureId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["getAllFeatures"],
        }),
      ]);
    },
  });
  const { mutate: createComment, isPending: commentIsPending } = useMutation({
    mutationFn: async (comment: {
      featureId: string;
      content: string;
      parentId?: string;
    }) => {
      await fetch(`${import.meta.env.VITE_API_URL}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      });
    },
    onSuccess: async () => {
      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: ["getFeature", featureId],
        }),
        await queryClient.invalidateQueries({
          queryKey: ["getAllFeatures"],
        }),
      ]);
      form.reset();
    },
  });

  const [replyTo, setReplyTo] = useState<null | {
    parentId: string;
    authorEmail: string;
  }>(null);

  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: ({ value }) => {
      createComment({
        featureId,
        content: value.content,
        parentId: replyTo?.parentId,
      });
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
                      ref={textareaRef}
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
                  {replyTo && `@reply to: ${replyTo.parentId}`}
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
              <CommentItem
                featureId={featureId}
                key={comment.id}
                onReply={(commentId: string) => {
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                  setReplyTo({
                    parentId: commentId,
                    authorEmail: comment.user.email,
                  });
                }}
                user={{ id: user.id, role: user.role }}
                comment={comment}
              />
            ))}
          </ul>
        )}
      </HeadingLevel>
    </Dialog>
  );
}

const CommentItem = ({
  comment,
  user,
  onReply,
  featureId,
}: {
  comment: CommentWithChildren;
  user: { role: "admin" | "user"; id: string };
  onReply: (commentId: string) => void;
  featureId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: deleteComment } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${import.meta.env.VITE_API_URL}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: async () => {
      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: ["getFeature", featureId],
        }),
        await queryClient.invalidateQueries({
          queryKey: ["getAllFeatures"],
        }),
      ]);
    },
  });
  const { mutate: updateComment, isPending: updateIsPending } = useMutation({
    mutationFn: async (newComment: { content: string }) => {
      console.log(newComment);
      await fetch(`${import.meta.env.VITE_API_URL}/comments/${comment.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      });
    },
    onSuccess: async () => {
      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: ["getFeature", featureId],
        }),
        await queryClient.invalidateQueries({
          queryKey: ["getAllFeatures"],
        }),
      ]);
      setIsEditing(false);
    },
  });

  const form = useForm({
    defaultValues: {
      content: comment.content,
    },
    onSubmit: ({ value }) => {
      updateComment(value);
    },
  });

  return (
    <div className="pl-4 not-first:pt-4  ">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <div className="text-sm text-gray-800">
            <strong>{comment.user.email}</strong> –{" "}
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString("fr-FR")}
            </span>
          </div>
          {!isEditing ? (
            <p>{comment.content}</p>
          ) : (
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
                      disabled={!canSubmit || updateIsPending}
                      className="flex-1"
                    >
                      {isSubmitting ? "..." : "Envoyer"}
                    </Button>
                  </div>
                )}
              />
            </form>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
            <VisuallyHidden>Edit</VisuallyHidden>
            <Pen />
          </Button>
          <Button onClick={() => onReply(comment.id)} variant="outline">
            <VisuallyHidden>Reply</VisuallyHidden>
            <Reply />
          </Button>
          {(comment.authorId === user.id || user.role === "admin") && (
            <Button
              onClick={() => deleteComment(comment.id)}
              variant="destructive"
            >
              <VisuallyHidden>Delete</VisuallyHidden>
              <Trash />
            </Button>
          )}
        </div>
      </div>

      {comment.children && comment.children.length > 0 && (
        <div className="mt-2 pt-2 border-l">
          {comment.children.map((child) => (
            <CommentItem
              featureId={featureId}
              onReply={onReply}
              user={user}
              key={child.id}
              comment={child}
            />
          ))}
        </div>
      )}
    </div>
  );
};
