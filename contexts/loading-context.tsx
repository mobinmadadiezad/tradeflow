"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import GlobalLoader from "@/components/shared/global-loader";

type LoadingContextType = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("ANALYZING MARKET");

  const showLoading = (newMessage?: string) => {
    setMessage(newMessage || "ANALYZING MARKET");
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}

      <GlobalLoader isLoading={isLoading} message={message} />
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useGlobalLoading must be used inside LoadingProvider");
  }

  return context;
}
