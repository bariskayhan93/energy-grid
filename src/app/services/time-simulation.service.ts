import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap, timer, filter } from 'rxjs';
import { GridStateService } from './grid-state.service';

@Injectable({ providedIn: 'root' })
export class TimeSimulationService {
  private gridState = inject(GridStateService);

  private playing$ = new BehaviorSubject(false);
  readonly playing = this.playing$.asObservable();

  private speed$ = new BehaviorSubject<1 | 2 | 4>(1);
  readonly speed = this.speed$.asObservable();

  private currentHour = 12;

  constructor() {
    this.gridState.currentHour$.pipe(takeUntilDestroyed())
      .subscribe(h => this.currentHour = h);

    this.speed$.pipe(
      switchMap(speed => timer(Math.round(1000 / speed), Math.round(1000 / speed))),
      filter(() => this.playing$.value),
      takeUntilDestroyed(),
    ).subscribe(() => {
      this.currentHour = (this.currentHour + 1) % 24;
      this.gridState.setHour(this.currentHour);
    });
  }

  toggle() { this.playing$.next(!this.playing$.value); }

  cycleSpeed() {
    const steps: (1 | 2 | 4)[] = [1, 2, 4];
    const idx = steps.indexOf(this.speed$.value);
    this.speed$.next(steps[(idx + 1) % steps.length]);
  }
}
