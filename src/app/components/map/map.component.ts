import { Component, DestroyRef, afterNextRender, inject, ElementRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { GridStateService } from '../../services/grid-state.service';
import { LOAD_STATUS_COLORS, LoadStatus } from '../../models';
import { GridFeatureCollection } from '../../models/geojson.types';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  private gridState = inject(GridStateService);
  private destroyRef = inject(DestroyRef);
  private mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');
  private map!: L.Map;
  private geoLayer!: L.GeoJSON;
  private selectedId: string | null = null;

  constructor() {
    afterNextRender(() => this.initMap());

    this.gridState.selectedDetail$.pipe(takeUntilDestroyed())
      .subscribe(d => this.selectedId = d?.element.id ?? null);
  }

  private initMap() {
    this.map = L.map(this.mapEl().nativeElement, { zoomControl: false }).setView([50.775, 6.084], 16);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(this.map);

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.geoLayer = L.geoJSON(undefined, {
      style: (feature) => {
        const color = LOAD_STATUS_COLORS[feature!.properties.status as LoadStatus] ?? '#6b7280';
        const selected = feature!.properties.id === this.selectedId;
        return {
          color, weight: selected ? 5 : 3, opacity: 0.9,
          ...(selected && { dashArray: '6 4' }),
        };
      },
      pointToLayer: (feature, latlng) => {
        const color = LOAD_STATUS_COLORS[feature.properties.status as LoadStatus] ?? '#6b7280';
        const isTrafo = feature.properties.type === 'transformer';
        return L.circleMarker(latlng, {
          radius: isTrafo ? 12 : 7,
          fillColor: color, color: isTrafo ? '#fff' : color,
          weight: isTrafo ? 3 : 2, fillOpacity: 0.85,
        });
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => this.gridState.selectElement(feature.properties.id));
        layer.bindTooltip(feature.properties.name, { className: 'grid-tooltip' });
      },
    }).addTo(this.map);

    this.gridState.geoJson$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(geo => this.updateLayer(geo));
  }

  private updateLayer(geo: GridFeatureCollection) {
    this.geoLayer.clearLayers();
    this.geoLayer.addData(geo as any);
  }
}
