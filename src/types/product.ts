export interface ProductCardType {
  id: string;
  title: string;
  description: string;
  quantity: number;
  isNew: boolean;
  price: number;
  ownerId: string;
  categoryId: string;
  address: ProductAddress;
  attributes: ProductAttribute[];
  images: string[];
  active: boolean;
  createdAt: string;
}

export interface ProductAddress {
  region: string;
  city: string;
  location: {
    lat: number;
    lon: number;
  };
}

export interface ProductAttribute {
  id: string;
  values: string[] | null;
}

export interface Pagination {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface SearchProductsResponse {
  data: ProductCardType[];
  metadata: Pagination;
}
