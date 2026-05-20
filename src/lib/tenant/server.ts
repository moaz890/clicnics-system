import { headers } from "next/headers";
import { TENANT_HEADER } from "./constants";

export async function getTenantIdFromHeaders(): Promise<string | null> {
  const headerStore = await headers();
  const tenantId = headerStore.get(TENANT_HEADER);
  return tenantId && tenantId.length > 0 ? tenantId : null;
}
