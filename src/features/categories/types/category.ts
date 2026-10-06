export type CategoryType = "PARENT" | "SUB" | "CHILD";

export type CategoryAttributeType =
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "ENUM"
  | "RANGE";

export interface CategoryAttribute {
  id: string;
  title: string;
  slug: string;
  type: CategoryAttributeType;
  required: boolean;
  allowedValues: string[];
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  type: CategoryType;
  attributes: CategoryAttribute[];
  path: string[];
  children: Category[];
}

export interface CategoriesResponse {
  data: Category[];
}

export interface CategoryOption {
  id: string;
  title: string;
  slug: string;
  type: CategoryType;
  children: CategoryOption[];
}
