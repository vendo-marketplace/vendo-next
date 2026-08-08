import { useQuery } from "@tanstack/react-query";

import { authQueries } from "../queries/auth.queries";

export const useMe = () => useQuery(authQueries.me());
