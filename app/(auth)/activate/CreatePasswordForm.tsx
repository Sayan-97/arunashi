"use client";

import { useActionState } from "react";
import { activate } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreatePasswordFormProps {
  token: string;
}

export default function CreatePasswordForm({ token }: CreatePasswordFormProps) {
  const [state, action, pending] = useActionState(activate, undefined);

  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[486px] p-10 bg-secondary">
        <div className="text-center space-y-3 mb-7">
          <h1>Create a password</h1>
          <p className="w-3/4 mx-auto text-secondary-foreground">
            Create a secure password to access your Arunashi retailer account
          </p>
        </div>
        <form action={action} className="space-y-7 flex flex-col">
          <input type="hidden" name="token" value={token} />

          <div className="space-y-5.5">
            <div className="space-y-1.5">
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full h-[57px] rounded-none border-0"
              />
              {state?.errors?.password && (
                <p className="text-xs text-red-500 font-medium pl-1">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className="w-full h-[57px] rounded-none border-0"
              />
              {state?.errors?.confirmPassword && (
                <p className="text-xs text-red-500 font-medium pl-1">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>

            {state?.errors?.form && (
              <p className="text-sm text-red-500 font-medium text-center">
                {state.errors.form}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={pending}
            variant="outline"
            size="lg"
            className="px-10 self-center"
          >
            {pending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </section>
    </div>
  );
}
