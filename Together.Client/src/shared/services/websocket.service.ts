import { Injectable } from '@angular/core';
import { environment } from '~env/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { interval } from 'rxjs';
import { webSocketTargets } from '~shared/constants';
import { IWebSocketMessage } from '~shared/models';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly URL =
    environment.baseWebSocketUrl +
    '/ws' +
    '?id=2656354c-6423-48f5-82d9-2906a815f648';

  private _client$: WebSocketSubject<any> = webSocket(this.URL);

  constructor() {
    this.keepConnect();
  }

  private keepConnect() {
    interval(60 * 1000).subscribe(() => {
      this.sendMessage(webSocketTargets.Ping, '');
    });
  }

  public getClient() {
    this.sendMessage(webSocketTargets.Ping, '');
    return this._client$;
  }

  public disconnect() {
    this._client$.complete();
  }

  public sendMessage(target: string, data: string) {
    this._client$.next({
      target: target,
      data: data,
    } as IWebSocketMessage);
  }
}
