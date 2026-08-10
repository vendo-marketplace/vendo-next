import AuthContent, {
  type AuthTab,
  type SignUpStep,
} from "../login/_components/content/AuthContent";
import AuthPoster from "../login/_components/poster/AuthPoster";

type AuthPageProps = {
  activeTab: AuthTab;
  signUpStep?: SignUpStep;
  signUpEmail?: string;
  onSignUpSuccess?: (email: string) => void;
  onVerifySuccess?: () => void;
};

const AuthPage = ({
  activeTab,
  signUpStep,
  signUpEmail,
  onSignUpSuccess,
  onVerifySuccess,
}: AuthPageProps) => {
  return (
    <section className="flex flex-1 p-4">
      <AuthContent
        activeTab={activeTab}
        signUpStep={signUpStep}
        signUpEmail={signUpEmail}
        onSignUpSuccess={onSignUpSuccess}
        onVerifySuccess={onVerifySuccess}
      />
      <AuthPoster />
    </section>
  );
};

export default AuthPage;
