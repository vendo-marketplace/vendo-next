import { useInfiniteQuery } from "@tanstack/react-query";

import { productQueries } from "../queries/product.queries";

export const useSearchProducts = (query: string) =>
  useInfiniteQuery(productQueries.search(query));
