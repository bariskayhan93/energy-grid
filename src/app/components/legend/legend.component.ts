import { Component } from '@angular/core';
import { LoadStatus, LOAD_STATUS_COLORS, LOAD_STATUS_LABELS } from '../../models';

@Component({
  selector: 'app-legend',
  standalone: true,
  templateUrl: './legend.component.html',
  styleUrl: './legend.component.scss',
})
export class LegendComponent {
  statusList = Object.values(LoadStatus);
  colors = LOAD_STATUS_COLORS;
  labels = LOAD_STATUS_LABELS;
}
