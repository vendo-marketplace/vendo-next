import AuthContent, {
  type AuthTab,
} from "../login/_components/content/AuthContent";
import AuthPoster from "../login/_components/poster/AuthPoster";

const AuthPage = ({ activeTab }: { activeTab: AuthTab }) => {
  return (
    <section className="flex flex-1 p-4">
      <AuthContent activeTab={activeTab} />
      <AuthPoster />
    </section>
  );
};

export default AuthPage;
