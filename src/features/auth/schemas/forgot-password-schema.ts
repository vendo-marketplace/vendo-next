import { z } from "zod";

import type { ForgotPasswordCredentials } from "../types/auth";
import { authFieldsSchema } from "./auth-fields-schema";

export const forgotPasswordSchema = z.object({
  email: authFieldsSchema.email,
}) satisfies z.ZodType<ForgotPasswordCredentials>;
