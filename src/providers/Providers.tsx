import { type ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AuthProvider from "./AuthProvider";
import { Toaster } from "sonner";
import GoogleAuthProvider from "./GoogleAuthProvider";
import IconPixelSnap from "@/components/ui/icon-pixel-snap";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
          <IconPixelSnap />
        </AuthProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
};

export default Providers;
