export type SnDataTableSortOrder = string | 'asc' | 'desc' | null;

export interface SnDataTableQueryParams {
  pageIndex: number;
  pageSize: number;
  // sort: Array<{ key: string; value: NzTableSortOrder }>;
  // filter: Array<{ key: string; value: NzTableFilterValue }>;
}

export interface SnDataTableColumn {
  title: string;
  field: string;
  filterable?: boolean;
  sortable?: boolean;
  visible: boolean;
  tooltip?: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local';
  // summaryOperator?: 'sum';
  // cell?: (item: any) => any;
}
