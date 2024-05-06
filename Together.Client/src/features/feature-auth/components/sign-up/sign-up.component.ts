import { Component } from '@angular/core';
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
import { RouterLink } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import {
  authLoadingSelector,
  ISignUpRequest,
  signUp,
} from '~features/feature-auth/store';
import { Store } from '@ngrx/store';
import { BaseComponent } from '~core/abstractions';
import { emailPattern } from '~shared/constants';

@Component({
  selector: 'together-sign-up',
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
  ],
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export class SignUpComponent extends BaseComponent {
  signUpForm!: FormGroup<{
    fullName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  confirmPasswordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
    if (control.value !== this.signUpForm.get('password')?.value) {
      return { notMatched: true };
    }
    return {};
  };

  loading$: Observable<boolean> = this.store
    .select(authLoadingSelector)
    .pipe(takeUntil(this.destroy$));

  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private store: Store,
  ) {
    super();
    this.signUpForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailPattern)]],
      password: ['', [Validators.required]],
      confirmPassword: [
        '',
        [Validators.required, this.confirmPasswordMatchValidator],
      ],
    });
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      Object.values(this.signUpForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.store.dispatch(
      signUp({ payload: this.signUpForm.value as ISignUpRequest }),
    );
  }
}
