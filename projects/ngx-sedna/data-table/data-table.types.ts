import { SnFilter } from "../filter";

export type SnDataTableSortOrder = string | 'asc' | 'desc' | null;

export interface SnDataTableSort {
  field: string;
  direction: SnDataTableSortOrder;
}

export interface SnDataTableQueryParams {
  pageIndex: number;
  pageSize: number;
  filter: SnFilter[];
  sort: SnDataTableSort[]
}

export interface SnDataTableColumn {
  title: string;
  field: string;
  filterable?: boolean;
  sortable?: boolean;
  visible?: boolean;
  tooltip?: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local';
  // summaryOperator?: 'sum';
  // cell?: (item: any) => any;
}
