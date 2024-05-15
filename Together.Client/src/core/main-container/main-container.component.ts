import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '~core/main-container/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  IGetMeResponse,
  me,
  userMeSelector,
} from '~features/feature-user/store';
import { WebSocketService } from '~shared/services';
import { IWebSocketMessage } from '~shared/models';
import { webSocketTargets } from '~shared/constants';
import { receivedMessage } from '~features/feature-inbox/store';

@Component({
  selector: 'together-main-container',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NgIf, AsyncPipe],
  templateUrl: './main-container.component.html',
})
export class MainContainerComponent implements OnInit {
  me$: Observable<IGetMeResponse | null> = this.store.select(userMeSelector);

  constructor(
    private store: Store,
    private webSocketService: WebSocketService,
  ) {}

  ngOnInit() {
    this.store.dispatch(me());
    this.webSocketService
      .getClient()
      .subscribe((webSocketMessage: IWebSocketMessage) => {
        console.log('WebSocketReceived', webSocketMessage);
        if (webSocketMessage.target === webSocketTargets.ReceiveMessage) {
          this.store.dispatch(
            receivedMessage({ message: webSocketMessage.data }),
          );
        }
      });
  }
}
