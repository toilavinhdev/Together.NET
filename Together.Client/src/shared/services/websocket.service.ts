import { Injectable } from '@angular/core';
import { environment } from '~env/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { interval } from 'rxjs';
import { webSocketTargets } from '~shared/constants';
import { IWebSocketMessage } from '~shared/models';
import { AuthService } from '~features/feature-auth/store';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly baseUrl = environment.baseWebSocketUrl;

  private _client$: WebSocketSubject<any> = webSocket(this.createUrl());

  constructor(private authService: AuthService) {
    this.keepConnect();
  }

  private createUrl() {
    const userId = this.authService.getUserClaimsPrincipal()?.id ?? '';
    return this.baseUrl + '/ws?id=' + userId;
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
