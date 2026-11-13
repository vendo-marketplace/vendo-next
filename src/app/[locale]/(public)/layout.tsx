import { ReactNode } from "react";
import AnnouncementBar from "@/app/[locale]/(public)/_components/announcement-bar/AnnouncementBar";
import Header from "@/app/[locale]/(public)/_components/header/Header";
import Footer from "@/app/[locale]/(public)/_components/footer/footer";
import MobileBottomNav from "@/app/[locale]/(public)/_components/bottom-nav/MobileBottomNav";
import { PhotoSearchDialog } from "@/features/photo-search/components/PhotoSearchDialog";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="page-shell flex flex-1 flex-col">{children}</main>
      <Footer />
      {/* Room under the footer so the phone bottom menu never covers it. */}
      <div
        aria-hidden="true"
        className="h-[calc(5.5rem+env(safe-area-inset-bottom))] md:h-[calc(6rem+env(safe-area-inset-bottom))] lg:hidden"
      />
      <MobileBottomNav />
      <PhotoSearchDialog />
    </>
  );
}
