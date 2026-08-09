import { z } from "zod";

import type { LoginCredentials } from "../types/auth";
import { authFieldsSchema } from "./auth-fields-schema";

export const signInSchema = z.object(
  authFieldsSchema,
) satisfies z.ZodType<LoginCredentials>;
