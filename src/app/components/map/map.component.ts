import {Component, DestroyRef, afterNextRender, inject, ElementRef, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import {GridStateService} from '../../services/grid-state.service';
import {LOAD_STATUS_COLORS, LoadStatus} from '../../models';
import {GridFeatureCollection} from '../../models/geojson.types';

const BASE_LAYERS = {
  'CARTO Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM &copy; CARTO',
    maxZoom: 19
  }),
  'OSM Standard': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }),
  'CARTO Voyager': L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM &copy; CARTO',
    maxZoom: 19
  })
};

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
    this.map = L.map(this.mapEl().nativeElement, {zoomControl: false}).setView([51.2260, 6.7730], 16);

    BASE_LAYERS['CARTO Dark'].addTo(this.map);
    L.control.zoom({position: 'topright'}).addTo(this.map);
    L.control.layers(BASE_LAYERS, undefined, {position: 'topright'}).addTo(this.map);

    this.geoLayer = L.geoJSON(undefined, {
      style: (feature) => {
        const status = feature!.properties.status as LoadStatus;
        const color = LOAD_STATUS_COLORS[status] ?? '#6b7280';
        const selected = feature!.properties.id === this.selectedId;
        const isAlert = status === LoadStatus.Error || status === LoadStatus.Critical;
        return {
          color, weight: selected ? 5 : 3, opacity: 0.9,
          className: isAlert ? `cable-glow--${status}` : '',
          ...(selected && {dashArray: '6 4'}),
        };
      },
      pointToLayer: (feature, latlng) => {
        const status = feature.properties.status as LoadStatus;
        const color = LOAD_STATUS_COLORS[status] ?? '#6b7280';
        const isTrafo = feature.properties.type === 'transformer';
        return L.circleMarker(latlng, {
          radius: isTrafo ? 13 : 8,
          fillColor: color,
          color: isTrafo ? '#fff' : color,
          weight: isTrafo ? 3 : 2,
          fillOpacity: 0.85,
          className: isTrafo ? 'marker-trafo' : '',
        });
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => this.gridState.selectElement(feature.properties.id));
        layer.bindTooltip(feature.properties.name, {className: 'grid-tooltip'});
      },
    }).addTo(this.map);

    this.gridState.geoJson$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(geo => {
        this.geoLayer.clearLayers();
        this.geoLayer.addData(geo as any);
      });
  }
}
