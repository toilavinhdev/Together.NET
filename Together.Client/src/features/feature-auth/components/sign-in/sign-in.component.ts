import { Component } from '@angular/core';
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { RouterLink } from '@angular/router';
import { AsyncPipe, JsonPipe, NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  authLoadingSelector,
  ISignInRequest,
  signIn,
} from '~features/feature-auth/store';
import { Observable, takeUntil } from 'rxjs';
import { BaseComponent } from '~core/abstractions';
import { emailPattern } from '~shared/constants';
import {
  NzFormControlComponent,
  NzFormDirective,
  NzFormItemComponent,
  NzFormLabelComponent,
} from 'ng-zorro-antd/form';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
  selector: 'together-sign-in',
  standalone: true,
  imports: [
    NzInputDirective,
    ReactiveFormsModule,
    NzButtonComponent,
    RouterLink,
    JsonPipe,
    NgOptimizedImage,
    AsyncPipe,
    NzFormDirective,
    NzFormItemComponent,
    NzFormControlComponent,
    NzFormLabelComponent,
    NzCheckboxComponent,
    NzInputGroupComponent,
    NzRowDirective,
    NzColDirective,
    NzIconDirective,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent extends BaseComponent {
  signInForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(emailPattern)]],
    password: ['', [Validators.required]],
  });

  loading$: Observable<boolean> = this.store
    .select(authLoadingSelector)
    .pipe(takeUntil(this.destroy$));

  passwordVisible = false;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private store: Store,
  ) {
    super();
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      Object.values(this.signInForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    this.store.dispatch(
      signIn({ payload: this.signInForm.value as ISignInRequest }),
    );
  }
}
