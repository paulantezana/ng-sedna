export interface SnFilterEvaluation {
  id: number;
  logicalOperator: 'OR' | 'AND';
  prefix: 'DONDE' | 'DONDE NO';
  operator: string;
  title: string;
  field: string;
  type: 'text' | 'number' | 'date' | 'datetime-local'; // Add any other possible types here
  value1: string;
  value2: string;
}

export interface SnFilter {
  id: number;
  logicalOperator: 'OR' | 'AND';
  prefix: 'DONDE' | 'DONDE NO';
  eval: SnFilterEvaluation[];
}

export interface SnFilterPrefix {
  id: string;
  description: string;
}

export interface SnFilterStringOperator {
  id: string;
  description: string;
}

export interface SnFilterNumericOperator {
  id: string;
  description: string;
}

export interface SnFilterColumn {
  title: string;
  field: string;
  // filterable?: boolean;
  // sortable?: boolean;
  // visible: boolean;
  // tooltip?: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local';
  // summaryOperator?: 'sum';
  // cell?: (item: any) => any;
}
