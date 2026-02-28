import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {GridStateService, SelectedDetail} from '../../services/grid-state.service';
import {LOAD_STATUS_COLORS, LOAD_STATUS_LABELS, LoadStatus, isCable, isTransformer} from '../../models';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './detail-panel.component.html',
  styleUrl: './detail-panel.component.scss',
})
export class DetailPanelComponent {
  gridState = inject(GridStateService);

  statusColor(d: SelectedDetail) {
    return LOAD_STATUS_COLORS[d.entry.status as LoadStatus] ?? '#6b7280';
  }

  statusLabel(d: SelectedDetail) {
    return LOAD_STATUS_LABELS[d.entry.status as LoadStatus];
  }

  isCable(d: SelectedDetail) {
    return isCable(d.element);
  }

  isTransformer(d: SelectedDetail) {
    return isTransformer(d.element);
  }

  asCable(d: SelectedDetail) {
    return d.element as any;
  }

  asTrafo(d: SelectedDetail) {
    return d.element as any;
  }

  close() {
    this.gridState.selectElement(null);
  }
}
