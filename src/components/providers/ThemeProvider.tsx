"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

/**
 * React 19 warns when next-themes renders its inline <script> during client
 * hydration. Keep the SSR script executable (theme applied before paint);
 * on the client, mark it as non-executable so React does not treat it as a
 * live script component.
 */
export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      scriptProps={scriptProps}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
