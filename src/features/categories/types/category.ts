export type CategoryType = "PARENT" | "SUB" | "CHILD";

export type CategoryAttributeType = "STRING";

export interface CategoryAttribute {
  id: string;
  title: string;
  slug: string;
  type: CategoryAttributeType;
  required: boolean;
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

/** The smaller category shape serialized from the server to the dropdown. */
export interface CategoryOption {
  id: string;
  title: string;
  slug: string;
  children: CategoryOption[];
}
