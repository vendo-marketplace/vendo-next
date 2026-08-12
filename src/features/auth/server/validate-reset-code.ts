import "server-only";

import { apiEndpoints } from "@/api/endpoints";
import { getApiUrl } from "@/api/get-api-url";

type ValidateCodeResponse = {
  valid: boolean;
};

export async function validateResetCode(code: string): Promise<boolean> {
  try {
    const endpoint = new URL(getApiUrl(apiEndpoints.verification.validate));
    endpoint.searchParams.set("code", code);

    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) return false;

    const result = (await response.json()) as ValidateCodeResponse;
    return result.valid === true;
  } catch {
    return false;
  }
}
