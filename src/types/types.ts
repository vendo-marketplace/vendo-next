export type ServerActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errorMessage: string;
    };

export type ApiError = {
  code: number;
  message: string;
  path: string;
  timestamp: string;
};

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};
