import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[togetherScrollEndReach]',
  standalone: true,
})
export class ScrollEndReachDirective {
  @Output() endReached = new EventEmitter<void>();
  @Input() thresholdPx = 40;
  private _endLock = false;

  constructor() {}

  @HostListener('scroll', ['$event.target'])
  onScroll(target: HTMLElement) {
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;

    const scrollPosition = scrollTop + clientHeight;

    const endReached = scrollPosition >= scrollHeight - this.thresholdPx;

    if (endReached && !this._endLock) {
      this.endReached.emit();
      this._endLock = true;
    } else if (!endReached) {
      this._endLock = false;
    }
  }
}
