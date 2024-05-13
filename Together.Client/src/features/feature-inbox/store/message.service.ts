import { Injectable } from '@angular/core';
import { BaseService } from '~core/abstractions';
import {
  IGetConversationRequest,
  IGetConversationResponse,
  IListConversationRequest,
  IListConversationResponse,
} from '~features/feature-inbox/store/message.models';
import { HttpClient } from '@angular/common/http';
import { IResult } from '~shared/models';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends BaseService {
  constructor(private client: HttpClient) {
    super();
    this.setEndpoint('/message');
  }

  listConversation(
    params: IListConversationRequest,
  ): Observable<IListConversationResponse> {
    const url = this.createUrl('/conversations');
    return this.client
      .get<IResult<IListConversationResponse>>(url, {
        params: this.createParamsFromObject(params),
      })
      .pipe(map((res) => res.data));
  }

  getConversation(
    params: IGetConversationRequest,
  ): Observable<IGetConversationResponse> {
    const url = this.createUrl(
      `/conversation/${params.conversationId}?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
    );
    return this.client
      .get<IResult<IGetConversationResponse>>(url)
      .pipe(map((res) => res.data));
  }
}
