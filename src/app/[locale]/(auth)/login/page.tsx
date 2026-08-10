import { redirect } from "next/navigation";

const LoginPage = async ({ params }: PageProps<"/[locale]/login">) => {
  const { locale } = await params;

  redirect(`/${locale}/sign-in`);
};

export default LoginPage;
