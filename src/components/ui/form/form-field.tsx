import { Label } from "../label";

type FieldControlProps = {
  id: string;
  invalid: boolean;
  required?: boolean;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  id: string;
  label: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  children: (props: FieldControlProps) => React.ReactNode;
};

export const FormField = ({
  id,
  label,
  error,
  required,
  children,
}: FormFieldProps) => {
  const errorId = `${id}-error`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      {children({
        id,
        invalid,
        required,
        "aria-describedby": invalid ? errorId : undefined,
      })}

      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
