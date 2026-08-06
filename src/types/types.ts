export type ServerActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errorMessage: string;
    };
