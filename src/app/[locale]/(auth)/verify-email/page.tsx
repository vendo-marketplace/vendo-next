import { Logo } from "@/components/ui/logo";
import type { VerificationFlow } from "@/features/auth/types/auth";
import { notFound } from "next/navigation";

import { VerifyEmail } from "./_components/verify-email/VerifyEmail";

type OTPPageProps = {
  searchParams: Promise<{
    email?: string | string[];
    otp?: string | string[];
    flow?: string | string[];
  }>;
};

const getSingleParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const isVerificationFlow = (
  value: string | undefined,
): value is VerificationFlow =>
  value === "signup" || value === "forgot-password";

const OTPPage = async ({ searchParams }: OTPPageProps) => {
  const params = await searchParams;
  const email = getSingleParam(params.email);
  const otp = getSingleParam(params.otp);
  const flow = getSingleParam(params.flow);

  if (!isVerificationFlow(flow)) {
    notFound();
  }

  return (
    <section className="flex flex-1 flex-col">
      <header className="flex items-center px-15 py-6">
        <Logo size="sm" />
      </header>

      <VerifyEmail email={email} initialOtp={otp} flow={flow} />

      <footer className="text-neutral-400 bg-neutral-50 border-neutral-100 mt-auto flex w-full border-t px-15">
        <div className="py-6">
          <span>© 2026 Vendo, LLC. Всі права захищені.</span>
        </div>
      </footer>
    </section>
  );
};

export default OTPPage;
