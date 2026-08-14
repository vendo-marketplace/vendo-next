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

export type SortDirection = "ASC" | "DESC";

export type PaginatedQuery<TSortBy extends string> = {
  page: number;
  size: number;
  sort: {
    sortBy: TSortBy;
    direction: SortDirection;
  };
};
