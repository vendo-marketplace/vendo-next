import { ReactNode } from "react";
import Header from "@/app/[locale]/(public)/_components/header/Header";
import Footer from "@/app/[locale]/(public)/_components/footer/footer";
import MobileBottomNav from "@/app/[locale]/(public)/_components/bottom-nav/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Header />
      <main className="page-shell flex flex-1 flex-col">
        {children}
      </main>
      <Footer />
      {/* Room under the footer so the phone bottom menu never covers it. */}
      <div aria-hidden="true" className="h-[calc(4.5rem+env(safe-area-inset-bottom))] md:hidden" />
      <MobileBottomNav />
    </>
  );
}
