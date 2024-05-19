import { SnSafeAny } from 'ngx-sedna/core/types';

export const statusColors = ['success', 'processing', 'error', 'default', 'warning'] as const;

export const presetColors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime'
] as const;

export type NzPresetColor = (typeof presetColors)[number];
export type NzStatusColor = (typeof statusColors)[number];

export function isPresetColor(color: string): color is NzPresetColor {
  return presetColors.indexOf(color as SnSafeAny) !== -1;
}

export function isStatusColor(color: string): color is NzPresetColor {
  return statusColors.indexOf(color as SnSafeAny) !== -1;
}
