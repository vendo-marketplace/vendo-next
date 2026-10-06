import { ReactNode } from "react";
import Header from "@/app/[locale]/(public)/_components/header/Header";
import Footer from "@/app/[locale]/(public)/_components/footer/footer";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-360 flex-1 flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
