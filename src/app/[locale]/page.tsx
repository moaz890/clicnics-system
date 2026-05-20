import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTenantIdFromHeaders } from "@/lib/tenant/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const tenantId = await getTenantIdFromHeaders();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-background p-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {t("appName")}
      </h1>
      {tenantId ? (
        <p className="text-muted-foreground">
          Tenant: <span className="font-mono">{tenantId}</span>
        </p>
      ) : (
        <p className="text-muted-foreground">Platform landing (no tenant)</p>
      )}
      <div className="flex gap-4">
        <Link
          href="/register"
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Register
        </Link>
        <Link
          href="/login"
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Sign in
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border border-border px-4 py-2 text-sm"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
