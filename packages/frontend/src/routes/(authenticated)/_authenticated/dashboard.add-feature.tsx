import { Button } from "@/src/components/ui/button";
import { Dialog } from "@/src/components/ui/dialog";
import { ErrorMessage } from "@/src/components/ui/error-message";
import { Input } from "@/src/components/ui/input";
import { DialogDismiss, DialogHeading } from "@ariakit/react";
import { createFeatureSchema } from "@shared/validators";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/dashboard/add-feature"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (feature: { title: string; description: string }) => {
      throw new Error("Erreur");
      await fetch(`/api/features`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feature),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAllFeatures"] });
      navigate({
        to: "/dashboard",
        replace: true,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return (
    <Dialog onClose={() => navigate({ to: "/dashboard" })}>
      <form
        className="relative space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex justify-between items-center">
          <DialogHeading className="heading">
            Créer une nouvelle feature
          </DialogHeading>
          <DialogDismiss className="absolute top-0 right-0 cursor-pointer">
            <Plus className="rotate-45" />
          </DialogDismiss>
        </div>
        <div>
          <form.Field
            validators={{ onChange: createFeatureSchema.shape.title }}
            name="title"
            children={(field) => {
              return (
                <div>
                  <label>
                    Titre
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                  {field.state.meta.errors[0]?.message && (
                    <ErrorMessage
                      message={field.state.meta.errors[0].message}
                    />
                  )}
                </div>
              );
            }}
          />
          <form.Field
            name="description"
            validators={{ onChange: createFeatureSchema.shape.description }}
            children={(field) => (
              <div>
                <label htmlFor={field.name}>
                  Description
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
                {field.state.meta.errors[0]?.message && (
                  <ErrorMessage message={field.state.meta.errors[0].message} />
                )}
              </div>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => state.canSubmit}
          children={(canSubmit) => (
            <Button
              type="submit"
              disabled={!canSubmit || isPending || isSuccess}
              className="w-full"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Ajouter"}
            </Button>
          )}
        />
      </form>
    </Dialog>
  );
}
