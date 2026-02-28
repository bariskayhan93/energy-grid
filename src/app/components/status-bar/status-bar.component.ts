import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GridStateService } from '../../services/grid-state.service';
import { LoadStatus, LOAD_STATUS_COLORS, LOAD_STATUS_LABELS } from '../../models';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  host: { class: 'glass' },
  imports: [AsyncPipe],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss',
})
export class StatusBarComponent {
  gridState = inject(GridStateService);
  statuses = Object.values(LoadStatus);
  colors = LOAD_STATUS_COLORS;
  labels = LOAD_STATUS_LABELS;
}
