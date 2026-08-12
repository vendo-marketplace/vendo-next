import { z } from "zod";

import { authFieldsSchema } from "./auth-fields-schema";

export const resetPasswordSchema = z.object({
  password: authFieldsSchema.password,
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
