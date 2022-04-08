import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {interval, merge, Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
})
export class CountdownComponent implements OnChanges, OnDestroy {

  @Input()
  expiresAt?: Date;

  @Output()
  readonly expired = new EventEmitter();
  private interval: Subscription;
  private expiredState = false;

  private readonly update = new Subject();

  timeRemaining = '';

  constructor() {
    this.interval = merge(interval(1000), this.update).subscribe(() => {
      const remaining = this.getTimeRemaining();
      if (remaining == null) {
        return;
      }
      if (remaining <= 0) {
        if (!this.expiredState) {
          this.expired.emit();
        }
        this.expiredState = true;
        this.timeRemaining = '';
      } else {
        this.expiredState = false;
        this.timeRemaining = CountdownComponent.formatTimeRemaining(remaining);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.expiresAt) {
      this.update.next();
    }
  }

  ngOnDestroy(): void {
    this.interval.unsubscribe();
  }

  private getTimeRemaining(): number | undefined {
    if (this.expiresAt == null) {
      return undefined;
    }
    const remainingTime = ((+new Date(this.expiresAt)) - (+new Date())) / 1000;
    return Math.max(0, Math.round(remainingTime));
  }

  private static formatTimeRemaining(timeRemaining: number | undefined): string {
    if (timeRemaining == null) {
      return '';
    }
    const seconds = timeRemaining % 60;
    const minutes = (timeRemaining - seconds) / 60;
    return `${minutes.toFixed(0).padStart(2, '0')}:${seconds.toFixed(0).padStart(2, '0')}`;
  }

}
