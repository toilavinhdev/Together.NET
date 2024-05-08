import { Component, Input } from '@angular/core';
import { IGetProfileResponse } from '~features/feature-user/store';
import { UserAvatarComponent } from '~shared/components';
import { ProfileFollowsComponent } from '~features/feature-user/components/profile-follows/profile-follows.component';
import { ProfileEditorComponent } from '~features/feature-user/components/profile-editor/profile-editor.component';

@Component({
  selector: 'together-profile',
  standalone: true,
  imports: [
    UserAvatarComponent,
    ProfileFollowsComponent,
    ProfileEditorComponent,
  ],
  templateUrl: './profile.component.html',
  styles: ``,
})
export class ProfileComponent {
  @Input() profile: IGetProfileResponse | null = null;
}
