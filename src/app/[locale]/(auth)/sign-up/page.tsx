"use client";

import { useState } from "react";

import AuthPage from "../_components/AuthPage";
import type { SignUpStep } from "../login/_components/content/AuthContent";

const SignUpPage = () => {
  const [step, setStep] = useState<SignUpStep>("form");
  const [email, setEmail] = useState("");

  const handleSignUpSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setStep("verify-code");
  };

  return (
    <AuthPage
      activeTab="sign-up"
      signUpStep={step}
      signUpEmail={email}
      onSignUpSuccess={handleSignUpSuccess}
      onVerifySuccess={() => setStep("success")}
    />
  );
};

export default SignUpPage;
