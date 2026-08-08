"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import type { ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useMe();
  console.log("data: ", data);

  return children;
};

export default AuthProvider;
