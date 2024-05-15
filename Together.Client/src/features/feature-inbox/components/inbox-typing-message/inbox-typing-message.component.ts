import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputDirective } from 'ng-zorro-antd/input';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '~core/abstractions';
import { JsonPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  ISendMessageRequest,
  MessageEffects,
  sendMessage,
} from '~features/feature-inbox/store';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'together-inbox-typing-message',
  standalone: true,
  imports: [NzButtonComponent, NzInputDirective, ReactiveFormsModule, JsonPipe],
  templateUrl: './inbox-typing-message.component.html',
  styles: ``,
})
export class InboxTypingMessageComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() conversationId = '';

  form: FormGroup<{
    conversationId: FormControl<string>;
    text: FormControl<string>;
  }> = this.formBuilder.group({
    conversationId: [this.conversationId, [Validators.required]],
    text: ['', [Validators.required, Validators.maxLength(512)]],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private store: Store,
    private messageEffects: MessageEffects,
  ) {
    super();
  }

  ngOnInit() {
    this.messageEffects.sendMessageSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.get('text')?.setValue('');
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('conversationId' in changes) {
      const conversationId = changes['conversationId'];
      this.form.get('conversationId')?.setValue(conversationId.currentValue);
    }
  }

  sendMessage() {
    if (this.form.invalid) return;
    console.log('click send');

    this.store.dispatch(
      sendMessage({ payload: this.form.value as ISendMessageRequest }),
    );
  }
}
