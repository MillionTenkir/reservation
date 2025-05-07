"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      forcedTheme={props.forcedTheme || "light"}
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
