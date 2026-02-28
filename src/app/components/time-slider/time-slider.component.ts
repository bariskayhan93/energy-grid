import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GridStateService } from '../../services/grid-state.service';
import { TimeSimulationService } from '../../services/time-simulation.service';

@Component({
  selector: 'app-time-slider',
  standalone: true,
  host: { class: 'glass' },
  imports: [AsyncPipe],
  templateUrl: './time-slider.component.html',
  styleUrl: './time-slider.component.scss',
})
export class TimeSliderComponent {
  gridState = inject(GridStateService);
  sim = inject(TimeSimulationService);

  onSlide(e: Event) {
    this.gridState.setHour(+(e.target as HTMLInputElement).value);
  }

  formatHour(h: number) { return `${String(h).padStart(2, '0')}:00`; }
}
