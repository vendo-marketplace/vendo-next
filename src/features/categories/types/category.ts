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
  allowedValues?: string[];
}

export interface CategoryImage {
  key: string;
  url: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  type: CategoryType;
  image?: CategoryImage;
  attributes: CategoryAttribute[];
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
  image?: CategoryImage;
  attributes: CategoryAttribute[];
  children: CategoryOption[];
}
