import { tuple } from './type';

export type SnStatus = '' | 'error' | 'warning';

const ValidateStatuses = tuple('success', 'warning', 'error', 'validating', '');
export type SnValidateStatus = (typeof ValidateStatuses)[number];
