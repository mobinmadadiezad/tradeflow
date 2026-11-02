"use client";

import { ReactNode } from "react";
import { LoadingProvider } from "@/contexts/loading-context";

export default function Providers({ children }: { children: ReactNode }) {
  return <LoadingProvider>{children}</LoadingProvider>;
}
