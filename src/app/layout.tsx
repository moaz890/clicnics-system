/**
 * Root layout — html/body live in `app/[locale]/layout.tsx`
 * so locale-driven `lang` and `dir` are set correctly.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
