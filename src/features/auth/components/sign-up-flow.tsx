"use client";

import { useState } from "react";

import { AccountCreated } from "./account-created";
import { AuthForm } from "./auth-form";
import { VerifyCode } from "./verify-code";

type SignUpState =
  | { step: "form" }
  | { step: "verify-code"; email: string }
  | { step: "success" };

export function SignUpFlow() {
  const [state, setState] = useState<SignUpState>({ step: "form" });

  switch (state.step) {
    case "form":
      return (
        <AuthForm
          activeTab="sign-up"
          onSignUpSuccess={(email) => setState({ step: "verify-code", email })}
        />
      );
    case "verify-code":
      return (
        <VerifyCode
          email={state.email}
          onSuccess={() => setState({ step: "success" })}
        />
      );
    case "success":
      return <AccountCreated />;
  }
}
