import { Input } from "@/src/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { loginSchema } from "../../../../../shared/src/validators";

import { Button } from "@/src/components/ui/button";
import { Heading } from "@ariakit/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/(auth)/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      return data.data;
    },
    onSuccess: async (data) => {
      await queryClient.setQueryData(["currentUser"], data);
      navigate({
        to: "/dashboard",
        replace: true,
      });
    },
    onError: async () => {
      form.setErrorMap({
        onSubmit: {
          fields: {
            email: { message: "Cet email est déjà utilisé" },
          },
        },
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
      <Heading>Inscription</Heading>
      <div>
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
        </div>
        <div>
          {" "}
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
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="default"
              disabled={!canSubmit}
              className="flex-1"
            >
              {isSubmitting ? "..." : "Inscription"}
            </Button>
          </div>
        )}
      />

      <div>
        <span>
          Vous avez déjà un compte ?{" "}
          <Link className="font-semibold" to="/auth/login">
            Connectez-vous
          </Link>
        </span>
      </div>
    </form>
  );
}
