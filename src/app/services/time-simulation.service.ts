import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, interval, filter } from 'rxjs';
import { GridStateService } from './grid-state.service';

@Injectable({ providedIn: 'root' })
export class TimeSimulationService {
  private gridState = inject(GridStateService);

  private playing$ = new BehaviorSubject(false);
  readonly playing = this.playing$.asObservable();
  private currentHour = 12;

  constructor() {
    this.gridState.currentHour$.pipe(takeUntilDestroyed())
      .subscribe(h => this.currentHour = h);

    interval(1000).pipe(
      filter(() => this.playing$.value),
      takeUntilDestroyed(),
    ).subscribe(() => {
      this.currentHour = (this.currentHour + 1) % 24;
      this.gridState.setHour(this.currentHour);
    });
  }

  toggle() { this.playing$.next(!this.playing$.value); }
}
