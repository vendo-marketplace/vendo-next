import axios from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import type { ApiError } from "@/types/types";

export type ApiErrorDetails = {
  message?: string;
  fieldErrors: Record<string, string>;
};

export const SERVER_ERROR_KEY = "root.server" as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeFieldName = (field: string) =>
  field.toLowerCase().replace(/[^a-z0-9]/g, "");

const toFieldErrors = (errors: unknown): Record<string, string> => {
  if (!isRecord(errors)) return {};

  return Object.fromEntries(
    Object.entries(errors).flatMap(([field, value]) => {
      if (typeof value === "string" && value.trim()) return [[field, value.trim()]];
      if (Array.isArray(value)) {
        const message = value.filter((item) => typeof item === "string").join(" ");
        return message ? [[field, message]] : [];
      }
      return [];
    }),
  );
};

export function getApiErrorDetails(error: unknown): ApiErrorDetails {
  const data: unknown = axios.isAxiosError<ApiError>(error)
    ? error.response?.data
    : null;
  if (!isRecord(data)) return { fieldErrors: {} };

  const message =
    typeof data.message === "string" ? data.message.trim() || undefined : undefined;

  return { message, fieldErrors: toFieldErrors(data.errors) };
}

/**
 * Human-readable message for places without per-field UI (toasts, banners).
 * When the API returns field errors, those are more useful than the generic
 * "Validation failed." summary, so they replace it.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  const details = getApiErrorDetails(error);
  const fieldMessages = [...new Set(Object.values(details.fieldErrors))];

  if (fieldMessages.length > 0) return fieldMessages.join(" ");
  if (details.message) return details.message;

  return fallback;
}

const findFieldErrorKey = (
  fieldErrors: Record<string, string>,
  field: string,
): string | undefined => {
  const normalizedField = normalizeFieldName(field);
  return Object.keys(fieldErrors).find((key) => {
    const normalizedKey = normalizeFieldName(key);
    return normalizedKey === normalizedField || normalizedKey.endsWith(normalizedField);
  });
};

export function getApiFieldError(
  fieldErrors: Record<string, string>,
  field: string,
): string | undefined {
  const key = findFieldErrorKey(fieldErrors, field);
  return key ? fieldErrors[key] : undefined;
}

type ApplyApiErrorOptions<TFieldValues extends FieldValues> = {
  fields: readonly Path<TFieldValues>[];
  fallback: string;
};

/**
 * Puts API errors into a react-hook-form form: errors for known fields go under
 * those fields, everything else (unknown fields, general message) goes to
 * `errors.root.server`.
 */
export function applyApiErrorToForm<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  { fields, fallback }: ApplyApiErrorOptions<TFieldValues>,
) {
  const { message, fieldErrors } = getApiErrorDetails(error);
  const unmatchedErrors = { ...fieldErrors };
  let hasFieldError = false;

  for (const field of fields) {
    const key = findFieldErrorKey(fieldErrors, field);
    if (!key) continue;

    setError(
      field,
      { type: "server", message: fieldErrors[key] },
      { shouldFocus: !hasFieldError },
    );
    delete unmatchedErrors[key];
    hasFieldError = true;
  }

  const leftoverMessages = [...new Set(Object.values(unmatchedErrors))];
  const rootMessage =
    leftoverMessages.length > 0
      ? leftoverMessages.join(" ")
      : hasFieldError
        ? undefined
        : (message ?? fallback);

  if (rootMessage) {
    setError(SERVER_ERROR_KEY, { type: "server", message: rootMessage });
  }
}
