import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  subject$ = new Subject<boolean>();

  constructor() {}

  showGlobalLoading() {
    this.subject$.next(true);
  }

  hideGlobalLoading() {
    this.subject$.next(false);
  }
}
