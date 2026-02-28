import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MapComponent } from './components/map/map.component';
import { DetailPanelComponent } from './components/detail-panel/detail-panel.component';
import { TimeSliderComponent } from './components/time-slider/time-slider.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { LegendComponent } from './components/legend/legend.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapComponent, DetailPanelComponent, TimeSliderComponent, StatusBarComponent, LegendComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
