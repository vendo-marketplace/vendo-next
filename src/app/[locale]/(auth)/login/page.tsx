"use client";

import { Button } from "@/components/ui/button";
import { useLogin } from "@/features/auth/hooks/use-login";
import { authKeys } from "@/features/auth/queries/auth.keys";
import type { MeResponse } from "@/features/auth/types/auth";
import { useRouter } from "@/i18n/navigation";
import { useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useState } from "react";

const LoginPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: () => {
          const user = queryClient.getQueryData<MeResponse>(authKeys.me());
          console.log("Authenticated user:", user);
          router.push("/");
        },
      },
    );
  };

  return (
    <form className="bg-neutral-600 p-4 flex flex-col" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border"
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        Login
      </Button>
    </form>
  );
};

export default LoginPage;
