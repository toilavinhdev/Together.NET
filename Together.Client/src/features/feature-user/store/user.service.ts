import { Injectable } from '@angular/core';
import { BaseService } from '~core/abstractions';
import { map, Observable } from 'rxjs';
import {
  IGetProfileResponse,
  IUpdateProfileRequest,
} from '~features/feature-user/store/user.models';
import { HttpClient } from '@angular/common/http';
import { IResult } from '~core/models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private client: HttpClient) {
    super();
    this.setEndpoint('/user');
  }

  profile(username: string): Observable<IGetProfileResponse> {
    const url = this.createUrl(`/profile/${username}`);
    return this.client
      .get<IResult<IGetProfileResponse>>(url)
      .pipe(map((res) => res.data));
  }

  updateProfile(payload: IUpdateProfileRequest): Observable<IResult> {
    const url = this.createUrl('/update');
    return this.client.put<IResult>(url, payload);
  }
}
