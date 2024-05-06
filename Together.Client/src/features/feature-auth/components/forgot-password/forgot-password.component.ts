import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
} from 'ng-zorro-antd/form';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { emailPattern } from '~shared/constants';
import { Store } from '@ngrx/store';
import { Observable, takeUntil } from 'rxjs';
import {
  AuthEffects,
  authLoadingSelector,
  forgotPassword,
  IForgotPasswordRequest,
  INewPasswordRequest,
  IVerifyForgotPasswordRequest,
  newPassword,
  verifyForgotPasswordToken,
} from '~features/feature-auth/store';
import { BaseComponent } from '~core/abstractions';
import { NzAlertComponent } from 'ng-zorro-antd/alert';

@Component({
  selector: 'together-forgot-password',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgOptimizedImage,
    NzButtonComponent,
    NzCheckboxComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzRowDirective,
    ReactiveFormsModule,
    RouterLink,
    NzAlertComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styles: ``,
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {
  formType: 'forgot' | 'verify' | 'newPassword' = 'forgot';
  passwordVisible = false;
  confirmPasswordVisible = false;

  loading$: Observable<boolean> = this.store
    .select(authLoadingSelector)
    .pipe(takeUntil(this.destroy$));

  forgotStatus: 'idle' | 'success' | 'error' = 'idle';
  verifyStatus: 'idle' | 'success' | 'error' = 'idle';
  newPasswordStatus: 'idle' | 'success' | 'error' = 'idle';

  verifyData: IVerifyForgotPasswordRequest | undefined = undefined;

  forgotPasswordForm: FormGroup<{
    email: FormControl<string>;
  }> = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
  });

  newPasswordForm!: FormGroup<{
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  confirmPasswordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
    if (control.value !== this.newPasswordForm.get('newPassword')?.value) {
      return { notMatched: true };
    }
    return {};
  };

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private authEffects: AuthEffects,
  ) {
    super();
    this.newPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: [
        '',
        [Validators.required, this.confirmPasswordMatchValidator],
      ],
    });
  }

  ngOnInit() {
    this.checkFormType();
    this.forgotStatusTracking();
    this.verifyStatusTracking();
    this.newPasswordStatusTracking();
  }

  private checkFormType() {
    const userId = this.route.snapshot.params['userId'];
    const token = this.route.snapshot.params['token'];
    if (userId && token) {
      this.formType = 'verify';
      this.verifyData = { userId, token };
      this.onVerify();
    }
  }

  private forgotStatusTracking() {
    this.authEffects.forgotPasswordSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.forgotStatus = 'success';
      });
    this.authEffects.forgotPasswordFailed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.forgotStatus = 'error';
      });
  }

  private verifyStatusTracking() {
    this.authEffects.verifyForgotPasswordTokenSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.formType = 'newPassword';
        this.newPasswordForm.get('');
        this.verifyStatus = 'success';
      });
    this.authEffects.verifyForgotPasswordTokenFailed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.verifyStatus = 'error';
      });
  }

  private newPasswordStatusTracking() {
    this.authEffects.newPasswordSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.newPasswordStatus = 'success';
      });
    this.authEffects.newPasswordFailed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.newPasswordStatus = 'error';
      });
  }

  onForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      Object.values(this.forgotPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.store.dispatch(
      forgotPassword({
        payload: this.forgotPasswordForm.value as IForgotPasswordRequest,
      }),
    );
  }

  onVerify() {
    if (this.verifyData) {
      this.store.dispatch(
        verifyForgotPasswordToken({ params: this.verifyData }),
      );
    }
  }

  onNewPassword() {
    if (this.newPasswordForm.invalid) {
      Object.values(this.newPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.store.dispatch(
      newPassword({
        payload: {
          ...this.newPasswordForm.value,
          ...this.verifyData,
        } as INewPasswordRequest,
      }),
    );
  }
}
