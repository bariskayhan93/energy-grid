import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GridStateService } from '../../services/grid-state.service';
import { LoadStatus, LOAD_STATUS_COLORS } from '../../models';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss',
})
export class StatusBarComponent {
  gridState = inject(GridStateService);
  statuses = Object.values(LoadStatus);
  colors = LOAD_STATUS_COLORS;
}
