import type { Metadata } from "next";

import { NotFoundView } from "./_components/not-found/NotFoundView";

export const metadata: Metadata = {
  title: "Сторінку не знайдено",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
