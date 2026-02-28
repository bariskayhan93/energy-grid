import type { GridElement, LoadStatus } from './grid.types';

export interface GridFeatureProperties {
  id: string;
  name: string;
  type: GridElement['type'];
  status: LoadStatus;
  auslastung: number;
  P_trans: number;
  Q_trans: number;
  S_trans: number;
  P_verlust: number;
  Q_verlust: number;
}

export interface GridFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] } | { type: 'LineString'; coordinates: [number, number][] };
  properties: GridFeatureProperties;
}

export interface GridFeatureCollection {
  type: 'FeatureCollection';
  features: GridFeature[];
}
