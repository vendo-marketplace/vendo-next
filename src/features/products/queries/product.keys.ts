export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  search: (query: string) => [...productKeys.lists(), 'search', query] as const,
};
