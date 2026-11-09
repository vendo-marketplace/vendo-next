import { Label } from "./label";

type FieldControlProps = {
  id: string;
  invalid: boolean;
  required?: boolean;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  id: string;
  label: React.ReactNode;
  labelAction?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: (props: FieldControlProps) => React.ReactNode;
};

export const FormField = ({
  id,
  label,
  labelAction,
  error,
  required,
  children,
}: FormFieldProps) => {
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {labelAction}
      </div>

      <div className="flex flex-col w-full gap-1">
        {children({
          id,
          invalid,
          required,
          "aria-describedby": invalid ? errorId : undefined,
        })}

        {error && (
          <p id={errorId} role="alert" className="text-xs text-text-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
