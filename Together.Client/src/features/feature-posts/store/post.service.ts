import { Injectable } from '@angular/core';
import { BaseService } from '~core/abstractions';
import {
  ICreatePostRequest,
  ICreatePostResponse,
  ICreateReplyRequest,
  ICreateReplyResponse,
} from '~features/feature-posts/store/post.models';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResult } from '~shared/models';

@Injectable({
  providedIn: 'root',
})
export class PostService extends BaseService {
  constructor(private client: HttpClient) {
    super();
    this.setEndpoint('/post');
  }

  newPost(payload: ICreatePostRequest): Observable<ICreatePostResponse> {
    const url = this.createUrl('/new-post');
    return this.client
      .post<IResult<ICreatePostResponse>>(url, payload)
      .pipe(map((res) => res.data));
  }

  reply(payload: ICreateReplyRequest): Observable<ICreateReplyResponse> {
    const url = this.createUrl('/reply');
    return this.client
      .post<IResult<ICreateReplyResponse>>(url, payload)
      .pipe(map((res) => res.data));
  }

  likePost(postId: string): Observable<any> {
    const url = this.createUrl('/like');
    return this.client.post(url, { postId });
  }
}
