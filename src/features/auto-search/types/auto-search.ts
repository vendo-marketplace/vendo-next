export type AutoSearchStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";
export type UpdatableAutoSearchStatus = Exclude<AutoSearchStatus, "EXPIRED">;

export interface AutoSearchProduct {
  id: string;
  title: string;
  description: string;
  quantity: number;
  isNew: boolean;
  price: number;
  imageKeys: string[];
  ownerId: string;
  address: { city: string };
  categoryId: string;
  active: boolean;
  createdAt: string;
}

export interface AutoSearch {
  id: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  address?: { city: string };
  status: AutoSearchStatus;
  expirationDate: string;
  products?: AutoSearchProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface AutoSearchFilters {
  categoryId: string;
  priceRange?: { minPrice?: number; maxPrice?: number };
  address?: { city: string };
  expirationDate: string;
}

export interface UpdateAutoSearchRequest extends AutoSearchFilters {
  status: UpdatableAutoSearchStatus;
}

export interface AutoSearchFormValues {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  city: string;
  expirationDate: string;
  status: UpdatableAutoSearchStatus;
}

export interface AutoSearchListResponse {
  data: AutoSearch[];
}

export interface AutoSearchProductsResponse {
  data: AutoSearchProduct[];
}
