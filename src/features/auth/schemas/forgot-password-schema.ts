import { z } from "zod";

import { authFieldsSchema } from "./auth-fields-schema";

export const forgotPasswordSchema = z.object({
  email: authFieldsSchema.email,
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
