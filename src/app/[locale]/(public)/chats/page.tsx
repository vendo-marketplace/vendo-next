import { Suspense } from "react";

import LoadingSpinner from "@/components/ui/loading-spinner";
import ChatsPage from "@/features/chats/components/ChatsPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[60vh] place-items-center">
          <LoadingSpinner />
        </div>
      }
    >
      <ChatsPage />
    </Suspense>
  );
}
