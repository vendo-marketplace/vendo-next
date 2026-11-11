import { useMutation } from "@tanstack/react-query";

import { adminMutations } from "../mutations/admin.mutations";

export const useReindex = () => useMutation(adminMutations.reindex());
