import { booleanAttribute, Component, Input } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Store } from '@ngrx/store';
import { follow } from '~shared/features/feature-follow/store';

@Component({
  selector: 'together-btn-follow',
  standalone: true,
  imports: [NzButtonComponent],
  templateUrl: './btn-follow.component.html',
  styles: ``,
})
export class BtnFollowComponent {
  @Input() targetId = '';
  @Input() isFollowing = false;
  @Input({ transform: booleanAttribute }) btnBlock = false;
  @Input() btnClassName = '';
  @Input() loading = false;

  constructor(private store: Store) {}

  onFollow() {
    this.store.dispatch(follow({ userId: this.targetId }));
  }
}
