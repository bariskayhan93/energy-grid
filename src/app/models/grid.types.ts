export enum LoadStatus {
  Safe = 'safe',
  Stressed = 'stressed',
  Critical = 'critical',
  Error = 'error',
  Unknown = 'unknown',
}

export const LOAD_STATUS_COLORS: Record<LoadStatus, string> = {
  [LoadStatus.Safe]: '#22c55e',
  [LoadStatus.Stressed]: '#eab308',
  [LoadStatus.Critical]: '#f97316',
  [LoadStatus.Error]: '#ef4444',
  [LoadStatus.Unknown]: '#6b7280',
};

export function getLoadStatus(auslastung: number): LoadStatus {
  if (auslastung <= 70) return LoadStatus.Safe;
  if (auslastung <= 90) return LoadStatus.Stressed;
  if (auslastung <= 100) return LoadStatus.Critical;
  return LoadStatus.Error;
}

export interface ElectricalMeasurement {
  P_trans: number;
  Q_trans: number;
  S_trans: number;
  P_verlust: number;
  Q_verlust: number;
  auslastung: number;
}

interface BaseGridElement {
  id: string;
  name: string;
  measurement: ElectricalMeasurement;
}

export interface CableElement extends BaseGridElement {
  type: 'cable';
  fromNodeId: string;
  toNodeId: string;
  ratedCapacity: number;
  coordinates: [number, number][];
}

export interface NodeElement extends BaseGridElement {
  type: 'node';
  voltageKv: number;
  coordinates: [number, number];
}

export interface TransformerElement extends BaseGridElement {
  type: 'transformer';
  ratedPowerKva: number;
  coordinates: [number, number];
}

export type GridElement = CableElement | NodeElement | TransformerElement;

export interface TimeSeriesEntry {
  elementId: string;
  hour: number;
  measurement: ElectricalMeasurement;
  status: LoadStatus;
}

export type StatusSummary = Record<LoadStatus, number>;

export function isCable(el: GridElement): el is CableElement {
  return el.type === 'cable';
}

export function isNode(el: GridElement): el is NodeElement {
  return el.type === 'node';
}

export function isTransformer(el: GridElement): el is TransformerElement {
  return el.type === 'transformer';
}
