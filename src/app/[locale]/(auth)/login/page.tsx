import AuthContent from "./_components/content/AuthContent";
import AuthPoster from "./_components/poster/AuthPoster";

const LoginPage = () => {
  return (
    <section className="flex  bg-red-400 flex-1 p-4">
      <AuthContent />
      <AuthPoster />
    </section>
  );
};

export default LoginPage;
