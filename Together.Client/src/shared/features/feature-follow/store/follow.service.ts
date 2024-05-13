import { Injectable } from '@angular/core';
import { BaseService } from '~core/abstractions';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IResult } from '~shared/models';
import {
  IListFollowRequest,
  IListFollowResponse,
} from '~shared/features/feature-follow/store/follow.models';

@Injectable({
  providedIn: 'root',
})
export class FollowService extends BaseService {
  constructor(private client: HttpClient) {
    super();
    this.setEndpoint('/follow');
  }

  follow(targetId: string): Observable<boolean> {
    const url = this.createUrl('');
    return this.client
      .post<IResult<boolean>>(url, { targetId })
      .pipe(map((res) => res.data));
  }

  listFollow(request: IListFollowRequest): Observable<IListFollowResponse> {
    const url = this.createUrl('/list');
    return this.client
      .get<IResult<IListFollowResponse>>(url, {
        params: this.createParamsFromObject(request),
      })
      .pipe(map((res) => res.data));
  }
}
