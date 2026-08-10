import type { AuthTab } from "@/features/auth/components/auth-form";

import AuthContent from "./AuthContent";
import AuthPoster from "./AuthPoster";

type AuthPageProps = {
  activeTab: AuthTab;
};

const AuthPage = ({ activeTab }: AuthPageProps) => {
  return (
    <section className="flex flex-1 p-4">
      <AuthContent activeTab={activeTab} />
      <AuthPoster />
    </section>
  );
};

export default AuthPage;
