import { ReactNode } from "react";
import Header from "./_components/header/Header";
import Footer from "./_components/footer/footer";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
