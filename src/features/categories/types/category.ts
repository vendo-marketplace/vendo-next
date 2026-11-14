export type CategoryType = "PARENT" | "SUB" | "CHILD";

export type CategoryAttributeType =
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "ENUM"
  | "SELECT"
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

// What POST /categories returns: attributes are ids here, unlike in the tree.
export type CategoryResponse = {
  id: string;
  title: string;
  parentId?: string;
  type: CategoryType;
  attributes: string[];
};

export type CreateCategoryRequest = {
  title: string;
  slug: string;
  parentId?: string;
  // The API rejects an empty array: omit the field instead.
  attributes?: string[];
};

export type UpdateCategoryRequest = {
  title?: string;
  slug?: string;
  attributes?: string[];
};

export type AttributeFilters = {
  search?: string;
  type?: CategoryAttributeType;
};

export type CreateAttributeRequest = {
  title: string;
  slug: string;
  type: CategoryAttributeType;
  required?: boolean;
  // Required for ENUM and SELECT: non-empty, unique, non-blank.
  allowedValues?: string[];
};

// `type` cannot change after creation; `allowedValues` replaces the list.
export type UpdateAttributeRequest = Omit<CreateAttributeRequest, "type">;
