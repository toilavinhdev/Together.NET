import { Component, OnInit } from '@angular/core';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NgIf } from '@angular/common';
import { LoadingService } from '~shared/services';
import { BaseComponent } from '~core/abstractions';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'together-global-loading',
  standalone: true,
  imports: [NzSpinComponent, NgIf],
  templateUrl: './global-loading.component.html',
  styles: ``,
})
export class GlobalLoadingComponent extends BaseComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) {
    super();
  }

  ngOnInit() {
    this.loadingService.subject$
      .pipe(takeUntil(this.destroy$))
      .subscribe((l) => (this.loading = l));
  }
}
