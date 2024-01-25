export type SnDataTableSortOrder = string | 'asc' | 'desc' | null;

export interface SnDataTableQueryParams {
  pageIndex: number;
  pageSize: number;
  // sort: Array<{ key: string; value: NzTableSortOrder }>;
  // filter: Array<{ key: string; value: NzTableFilterValue }>;
}
