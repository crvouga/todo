export type Paginated<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};
