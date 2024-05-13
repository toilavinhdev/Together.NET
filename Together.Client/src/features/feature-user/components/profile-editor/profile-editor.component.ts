import { Component, Input, OnInit } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzModalComponent,
  NzModalContentDirective,
  NzModalFooterDirective,
  NzModalService,
} from 'ng-zorro-antd/modal';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { BaseComponent } from '~core/abstractions';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { RouterLink } from '@angular/router';
import {
  IGetProfileResponse,
  IUpdateProfileRequest,
  updateProfile,
  userUpdateProfileStatusSelector,
} from '~features/feature-user/store';
import { Observable, of, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { StatusType } from '../../../../shared/types';
import { AsyncPipe } from '@angular/common';
import { EGender } from '~shared/enums';

@Component({
  selector: 'together-profile-editor',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzModalComponent,
    NzModalContentDirective,
    ReactiveFormsModule,
    NzFormItemComponent,
    NzFormDirective,
    NzFormControlComponent,
    NzInputGroupComponent,
    NzInputDirective,
    NzModalFooterDirective,
    NzFormLabelComponent,
    NzCheckboxComponent,
    NzColDirective,
    NzRowDirective,
    RouterLink,
    AsyncPipe,
  ],
  providers: [NzModalService],
  templateUrl: './profile-editor.component.html',
  styles: ``,
})
export class ProfileEditorComponent extends BaseComponent implements OnInit {
  @Input() profile: IGetProfileResponse | null = null;
  visible = false;

  profileForm: FormGroup<{
    fullName: FormControl<string>;
    bio: FormControl<string | null>;
    dob: FormControl<any | null>;
    gender: FormControl<EGender | null>;
  }> = this.formBuilder.group({
    fullName: this.formBuilder.control<string>('', [
      Validators.required,
      Validators.maxLength(128),
    ]),
    bio: this.formBuilder.control<string | null>(null, [
      Validators.maxLength(128),
    ]),
    dob: this.formBuilder.control<any | null>(null),
    gender: this.formBuilder.control<EGender | null>(null),
  });

  status$: Observable<StatusType> = this.store
    .select(userUpdateProfileStatusSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private store: Store,
  ) {
    super();
  }

  ngOnInit() {
    this.status$.pipe().subscribe((status) => {
      if (status === 'success') {
        this.visible = false;
      }
    });
    this.bindProfileForm();
  }

  private bindProfileForm() {
    if (this.profile) {
      this.profileForm.get('fullName')?.setValue(this.profile.fullName);
      this.profileForm.get('bio')?.setValue(this.profile.bio!);
      this.profileForm.get('dob')?.setValue(this.profile.dob!);
      this.profileForm.get('gender')?.setValue(this.profile.gender!);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      Object.values(this.profileForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.store.dispatch(
      updateProfile({
        payload: this.profileForm.value as IUpdateProfileRequest,
      }),
    );
  }

  showModal(): void {
    this.visible = true;
    this.bindProfileForm();
  }

  handleOk(): void {
    this.visible = false;
  }

  handleCancel(): void {
    this.visible = false;
    setTimeout(() => {
      this.profileForm.reset();
    }, 300);
  }
}
