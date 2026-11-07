import { AlertCircle } from "lucide-react";

type FormErrorNoticeProps = {
  message: string;
  className?: string;
};

export function FormErrorNotice({ message, className = "" }: FormErrorNoticeProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800 ${className}`}
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
