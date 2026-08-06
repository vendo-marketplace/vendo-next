import { useSearchParams } from "next/navigation";

import { useRouter } from "@/i18n/navigation";

export const useSearchBar = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const search = (query: string) => {
    router.push({
      pathname: "/search",
      query: { q: query.trim() },
    });
  };

  return { initialQuery, search };
};
