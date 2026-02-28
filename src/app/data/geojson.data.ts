import { GridElement, TimeSeriesEntry } from '../models';
import { GridFeature, GridFeatureCollection } from '../models/geojson.types';

export function buildGeoJSON(elements: GridElement[], measurements: Map<string, TimeSeriesEntry>): GridFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: elements.map(el => {
      const entry = measurements.get(el.id);
      const m = entry?.measurement ?? el.measurement;
      const props = {
        id: el.id, name: el.name, type: el.type,
        status: entry?.status ?? 'unknown' as const,
        auslastung: m.auslastung, P_trans: m.P_trans, Q_trans: m.Q_trans,
        S_trans: m.S_trans, P_verlust: m.P_verlust, Q_verlust: m.Q_verlust,
      };

      if (el.type === 'cable') {
        return { type: 'Feature', geometry: { type: 'LineString', coordinates: el.coordinates.map(([lat, lng]) => [lng, lat]) }, properties: props } as GridFeature;
      }
      const [lat, lng] = el.coordinates;
      return { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] as [number, number] }, properties: props } as GridFeature;
    }),
  };
}
