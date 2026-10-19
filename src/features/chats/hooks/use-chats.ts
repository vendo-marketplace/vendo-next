import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";

import { conversationsApi } from "@/api/conversations";
import { chatKeys, chatQueries } from "@/features/chats/queries/chat.queries";
import type {
  CreateConversationRequest,
  Message,
  MessagePage,
  SendMessageRequest,
} from "@/features/chats/types/chat";

type SendMessageVariables = {
  id: string;
  request: SendMessageRequest;
  senderId: string;
};

type SendMessageContext = {
  previousData: InfiniteData<MessagePage> | undefined;
  queryKey: ReturnType<typeof chatKeys.messages>;
};

function addMessageToLatestPage(
  data: InfiniteData<MessagePage>,
  message: Message,
): InfiniteData<MessagePage> {
  const [latestPage, ...olderPages] = data.pages;
  const content = [...latestPage.content, message].sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
  );
  const totalElements = latestPage.totalElements + 1;
  const totalPages = Math.ceil(totalElements / latestPage.size);

  return {
    ...data,
    pages: [
      {
        ...latestPage,
        content,
        totalElements,
        totalPages,
        last: latestPage.number >= totalPages - 1,
        empty: false,
      },
      ...olderPages,
    ],
  };
}

export function useConversations(enabled = true) {
  return useQuery({ ...chatQueries.list(), enabled });
}

export function useConversation(id: string) {
  return useQuery(chatQueries.conversation(id));
}

export function useConversationMessages(id: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(id),
    queryFn: async ({ pageParam }) =>
      (await conversationsApi.messages(id, pageParam)).data,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    enabled: Boolean(id),
  });
}

export function useChatMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (request: CreateConversationRequest) =>
      conversationsApi.create(request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: chatKeys.list() }),
  });

  const send = useMutation({
    mutationFn: ({ id, request }: SendMessageVariables) =>
      conversationsApi.sendMessage(id, request),
    onMutate: async ({ id, request, senderId }) => {
      const queryKey = chatKeys.messages(id);
      await queryClient.cancelQueries({ queryKey, exact: true });
      const previousData = queryClient.getQueryData<InfiniteData<MessagePage>>(queryKey);
      if (!previousData) return { previousData, queryKey };

      const optimisticMessage: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        conversationId: id,
        senderId,
        content: request.message,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<InfiniteData<MessagePage>>(queryKey, (data) =>
        data ? addMessageToLatestPage(data, optimisticMessage) : data,
      );

      return { previousData, queryKey } satisfies SendMessageContext;
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      if (context.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
        return;
      }

      queryClient.removeQueries({ queryKey: context.queryKey, exact: true });
    },
    onSuccess: (_response, { id }, result) => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: chatKeys.conversation(id) }),
        queryClient.invalidateQueries({ queryKey: chatKeys.list() }),
      ];
      if (!result?.previousData) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: chatKeys.messages(id),
            exact: true,
          }),
        );
      }
      void Promise.all(invalidations);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => conversationsApi.remove(id),
    onSuccess: (_response, id) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.list() });
      queryClient.removeQueries({ queryKey: chatKeys.conversation(id) });
      queryClient.removeQueries({ queryKey: chatKeys.messages(id) });
    },
  });

  return { create, send, remove };
}
