import { Component, Input } from '@angular/core';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { NzImageDirective, NzImageService } from 'ng-zorro-antd/image';

@Component({
  selector: 'together-user-avatar',
  standalone: true,
  imports: [NzAvatarComponent, NzImageDirective],
  providers: [NzImageService],
  templateUrl: './user-avatar.component.html',
  styles: ``,
})
export class UserAvatarComponent {
  @Input() url: string | null | undefined;
  @Input() size = 64;
}
