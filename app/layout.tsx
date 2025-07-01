import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import QueryProvider from "@/components/query-provider";
import Header from "@/components/header";
import { AuthProvider } from "@/lib/auth-context";
import { AuthProvider as AuthProvider2 } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "CHECHE - Reservation System",
  description: "Book appointments with ease",
  generator: "cheche",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-inter`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <AuthProvider2>
                <Header />
                {children}
                <Toaster />
              </AuthProvider2>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
