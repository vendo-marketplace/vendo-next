export interface AttributeValueFilter {
  id: string;
  values: string[];
}

export interface SearchProductsQuery {
  categoryId?: string;
  active?: boolean;
  isNew?: boolean;
  sort: {
    sortBy: "CREATED_AT" | "PRICE";
    direction: "ASC" | "DESC";
  };
  ids?: string[];
  addressFilter?: {
    city: string;
  };
  attributeFilter?: {
    attributes: AttributeValueFilter[];
  };
  priceRangeFilter?: {
    minPrice?: number;
    maxPrice?: number;
  };
  size: number;
  page: number;
}

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
