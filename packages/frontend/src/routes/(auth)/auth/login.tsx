import { Input } from "@/src/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { loginSchema } from "../../../../../shared/src/validators";

import { Button } from "@/src/components/ui/button";
import { ButtonLink } from "@/src/components/ui/button-link";
import { Heading } from "@ariakit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/(auth)/auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      return data.data;
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(["currentUser"], data);

      navigate({
        to: "/dashboard",
        replace: true,
      });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return (
    <form
      className="space-y-6 m-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Heading>Connexion</Heading>
      <div>
        <form.Field
          validators={{ onChange: loginSchema.shape.email }}
          name="email"
          children={(field) => {
            return (
              <>
                <label>
                  Email:
                  <Input
                    id={field.name}
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
                {field.state.meta.errors[0]?.message && (
                  <span>{field.state.meta.errors[0]?.message}</span>
                )}
              </>
            );
          }}
        />
        <form.Field
          name="password"
          validators={{ onChange: loginSchema.shape.password }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Mot de passe:</label>
              <Input
                id={field.name}
                type="password"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors[0]?.message && (
                <span>{field.state.meta.errors[0]?.message}</span>
              )}
            </>
          )}
        />
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex gap-2">
            <ButtonLink
              to="/auth/register"
              variant="outline"
              className="flex-1"
            >
              {isSubmitting || mutation.isPending ? "..." : "Inscription"}
            </ButtonLink>
            <Button
              type="submit"
              disabled={!canSubmit || mutation.isPending || mutation.isSuccess}
              className="flex-1"
            >
              {isSubmitting ? "..." : "Connexion"}
            </Button>
          </div>
        )}
      />
    </form>
  );
}
