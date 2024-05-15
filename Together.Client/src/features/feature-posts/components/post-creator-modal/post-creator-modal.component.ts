import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  NzModalComponent,
  NzModalContentDirective,
  NzModalFooterDirective,
  NzModalService,
} from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { Observable, takeUntil, tap } from 'rxjs';
import { IGetMeResponse, userMeSelector } from '~features/feature-user/store';
import { Store } from '@ngrx/store';
import { BaseComponent } from '~core/abstractions';
import { UserAvatarComponent } from '~shared/components';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { NzAutosizeDirective, NzInputDirective } from 'ng-zorro-antd/input';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ICreatePostRequest,
  newPost,
  PostEffects,
} from '~features/feature-posts/store';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'together-post-creator',
  standalone: true,
  imports: [
    NzModalComponent,
    NzModalContentDirective,
    NzModalFooterDirective,
    NzButtonComponent,
    UserAvatarComponent,
    AsyncPipe,
    NzInputDirective,
    NzAutosizeDirective,
    ReactiveFormsModule,
    JsonPipe,
  ],
  providers: [NzModalService],
  templateUrl: './post-creator-modal.component.html',
  styles: ``,
})
export class PostCreatorModalComponent extends BaseComponent implements OnInit {
  @ViewChild('content') contentEl!: ElementRef;

  visible = false;

  postForm: FormGroup<{
    content: FormControl<string>;
  }> = this.formBuilder.group({
    content: ['', [Validators.required]],
  });

  me$: Observable<IGetMeResponse | null> = this.store
    .select(userMeSelector)
    .pipe(takeUntil(this.destroy$));

  constructor(
    private store: Store,
    private formBuilder: NonNullableFormBuilder,
    private postEffects: PostEffects,
    private notificationService: NzNotificationService,
    private modalService: NzModalService,
  ) {
    super();
  }

  ngOnInit() {
    this.handleEffects();
  }

  private handleEffects() {
    this.postEffects.newPostSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.visible = false;
        this.notificationService.success('Tạo bài viết thành công', '');
        this.postForm.reset();
      });
  }

  toggleModal() {
    this.visible = !this.visible;
    if (this.visible) {
      setTimeout(() => {
        this.contentEl.nativeElement.focus();
      }, 300);
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    this.store.dispatch(
      newPost({ payload: this.postForm.value as ICreatePostRequest }),
    );
  }

  handleCancel(): void {
    const hideModal = () => {
      this.visible = false;
      this.postForm.reset();
    };

    if (this.postForm.get('content')?.value === '') {
      hideModal();
    } else {
      this.modalService.confirm({
        nzTitle: 'Bạn có muốn hủy bài viết này?',
        nzCentered: true,
        nzOkText: 'Đồng ý',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => hideModal(),
        nzCancelText: 'Tiếp tục bài viết',
      });
    }
  }
}
