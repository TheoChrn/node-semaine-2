import { Input } from "@/src/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { loginSchema } from "../../../../../shared/src/validators";

import { Button } from "@/src/components/ui/button";
import { Heading } from "@ariakit/react";

export const Route = createFileRoute("/(auth)/auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
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
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </label>
              </>
            );
          }}
        />
        <form.Field
          name="password"
          validators={{ onChange: loginSchema.shape.email }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Mot de passe:</label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </>
          )}
        />
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
          <Link className="font-semibold" to="/auth/register">
            Connectez-vous
          </Link>
        </span>
      </div>
    </form>
  );
}
