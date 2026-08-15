import type { ProductCardType } from "@/types/product";
import client from "@/axios/axios";

import { apiEndpoints } from "./endpoints";

export interface FavoritesResponse {
  data: ProductCardType[];
}

export const favoritesApi = {
  get: async () => client.get<FavoritesResponse>(apiEndpoints.favorites),
};
