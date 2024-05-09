import { Component, Input } from '@angular/core';
import { IGetProfileResponse } from '~features/feature-user/store';
import { UserAvatarComponent } from '~shared/components';
import { ProfileFollowsComponent } from '~features/feature-user/components/profile-follows/profile-follows.component';
import { ProfileEditorComponent } from '~features/feature-user/components/profile-editor/profile-editor.component';
import { BtnFollowComponent } from '~shared/features/feature-follow/components/btn-follow/btn-follow.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'together-profile',
  standalone: true,
  imports: [
    UserAvatarComponent,
    ProfileFollowsComponent,
    ProfileEditorComponent,
    BtnFollowComponent,
    NgIf,
  ],
  templateUrl: './profile.component.html',
  styles: ``,
})
export class ProfileComponent {
  @Input() profile: IGetProfileResponse | null = null;
  @Input() isMe = false;
}
