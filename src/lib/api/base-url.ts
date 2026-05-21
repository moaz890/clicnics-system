/** Browser calls go through the Next.js proxy to avoid CORS / mixed-content issues. */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api-proxy";
  }

  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "http://localhost:4000/api"
  );
}
