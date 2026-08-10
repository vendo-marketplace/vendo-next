import { type ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import AuthProvider from "./AuthProvider";
import { Toaster } from "sonner";
import GoogleAuthProvider from "./GoogleAuthProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
};

export default Providers;
