import { Logo } from "@/components/ui/logo";
import React from "react";
import ForgotPassword from "./_components/forgot-password/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <section className="flex flex-col flex-1">
      <header className="py-6 px-15 flex items-center">
        <Logo size="sm" />
      </header>
      <ForgotPassword />
      <div className="flex mt-auto w-full border-t bg-neutral-50  border-neutral-100 px-15 text-neutral-400">
        <div className="py-6">
          <span>© 2026 Vendo, LLC. Всі права захищені.</span>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
