import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { GridElement, LoadStatus, StatusSummary, TimeSeriesEntry } from '../models';
import { GridFeatureCollection } from '../models/geojson.types';
import { ALL_GRID_ELEMENTS } from '../data/grid-elements.data';
import { getMeasurementsAtHour } from '../data/timeseries.data';
import { buildGeoJSON } from '../data/geojson.data';

export interface SelectedDetail {
  element: GridElement;
  entry: TimeSeriesEntry;
}

@Injectable({ providedIn: 'root' })
export class GridStateService {
  private hour$ = new BehaviorSubject(12);
  private selectedId$ = new BehaviorSubject<string | null>(null);

  readonly currentHour$ = this.hour$.asObservable();

  readonly measurements$ = this.hour$.pipe(
    map(h => getMeasurementsAtHour(h)),
  );

  readonly geoJson$ = this.measurements$.pipe(
    map(m => buildGeoJSON(ALL_GRID_ELEMENTS, m)),
  );

  readonly selectedDetail$ = combineLatest([this.selectedId$, this.measurements$]).pipe(
    map(([id, measurements]) => {
      if (!id) return null;
      const element = ALL_GRID_ELEMENTS.find(el => el.id === id);
      const entry = measurements.get(id);
      return element && entry ? { element, entry } : null;
    }),
  );

  readonly statusSummary$ = this.measurements$.pipe(
    map(measurements => {
      const summary = Object.fromEntries(
        Object.values(LoadStatus).map(s => [s, 0]),
      ) as StatusSummary;
      for (const [, entry] of measurements) summary[entry.status]++;
      return summary;
    }),
  );

  setHour(hour: number) { this.hour$.next(hour); }
  selectElement(id: string | null) { this.selectedId$.next(id); }
}
