"use client";

import React, { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

interface RedirectContextProps {
  children: React.ReactNode;
}

const RedirectContext = createContext<{
  isRedirecting: boolean;
}>({
  isRedirecting: false,
});

export function RedirectProvider({ children }: RedirectContextProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  useEffect(() => {
    // Only handle redirects when auth state is loaded
    if (!isLoading) {
      if (pathname === "/") {
        setIsRedirecting(true);
        if (user) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } else {
        setIsRedirecting(false);
      }
    }
  }, [pathname, router, user, isLoading]);

  if (isRedirecting || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <RedirectContext.Provider value={{ isRedirecting }}>
      {children}
    </RedirectContext.Provider>
  );
}

export function useRedirect() {
  const context = useContext(RedirectContext);
  if (context === undefined) {
    throw new Error("useRedirect must be used within a RedirectProvider");
  }
  return context;
}
