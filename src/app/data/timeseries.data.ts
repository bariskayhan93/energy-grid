import { ElectricalMeasurement, TimeSeriesEntry, getLoadStatus } from '../models';
import { ALL_GRID_ELEMENTS } from './grid-elements.data';

// Daily load curve multipliers (0–23h): night low → morning ramp → midday → evening peak → wind down
const LOAD_CURVE = [
  0.25, 0.22, 0.20, 0.19, 0.20, 0.28,
  0.45, 0.62, 0.75, 0.78, 0.80, 0.82,
  0.88, 0.90, 0.85, 0.80, 0.78, 0.88,
  0.95, 1.00, 0.92, 0.78, 0.60, 0.40,
];

// Base loads as fraction of capacity — higher values → critical/error at peaks
const BASE_LOAD: Record<string, number> = {
  'trafo-01': 0.65, 'node-01': 0.55, 'node-02': 0.50, 'node-03': 0.45,
  'node-04': 0.60, 'node-05': 0.70, 'node-06': 0.80, 'node-07': 0.55, 'node-08': 0.48,
  'cable-01': 0.60, 'cable-02': 0.55, 'cable-03': 0.50, 'cable-04': 0.65,
  'cable-05': 0.75, 'cable-06': 0.85, 'cable-07': 0.52, 'cable-08': 0.48,
  'cable-09': 0.58, 'cable-10': 0.90,
};

function measure(elementId: string, ratedCapacity: number, hour: number): ElectricalMeasurement {
  const auslastung = Math.min(150, Math.round((BASE_LOAD[elementId] ?? 0.5) * LOAD_CURVE[hour] * 105));
  const S_trans = Math.round((auslastung / 100) * ratedCapacity);
  const P_trans = Math.round(S_trans * 0.92);
  const Q_trans = Math.round(S_trans * 0.39);
  const loss = 0.02 + (auslastung / 100) * 0.03;
  return { P_trans, Q_trans, S_trans, P_verlust: Math.round(P_trans * loss), Q_verlust: Math.round(Q_trans * loss), auslastung };
}

function ratedCapacity(el: typeof ALL_GRID_ELEMENTS[number]): number {
  if (el.type === 'cable') return el.ratedCapacity;
  if (el.type === 'transformer') return el.ratedPowerKva;
  return 200;
}

export const TIME_SERIES: TimeSeriesEntry[] = ALL_GRID_ELEMENTS.flatMap(el =>
  Array.from({ length: 24 }, (_, hour) => {
    const m = measure(el.id, ratedCapacity(el), hour);
    return { elementId: el.id, hour, measurement: m, status: getLoadStatus(m.auslastung) };
  }),
);

export function getMeasurementsAtHour(hour: number): Map<string, TimeSeriesEntry> {
  return new Map(TIME_SERIES.filter(e => e.hour === hour).map(e => [e.elementId, e]));
}
