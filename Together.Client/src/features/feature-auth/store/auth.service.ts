import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '~core/abstractions';
import {
  IForgotPasswordRequest,
  INewPasswordRequest,
  ISignInRequest,
  ISignInResponse,
  ISignUpRequest,
  IUserClaimsPrincipal,
  IVerifyForgotPasswordRequest,
} from '~features/feature-auth/store/auth.models';
import { map, Observable } from 'rxjs';
import { IResult } from '~core/models';
import { jwtDecode } from 'jwt-decode';
import {
  ACCESS_TOKEN,
  USER_DATA,
} from '~features/feature-auth/store/auth.consts';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  constructor(private client: HttpClient) {
    super();
    this.setEndpoint('/auth');
  }

  signIn(payload: ISignInRequest): Observable<ISignInResponse> {
    const url = this.createUrl('/sign-in');
    return this.client
      .post<IResult<ISignInResponse>>(url, payload)
      .pipe(map((res) => res.data));
  }

  signUp(payload: ISignUpRequest): Observable<IResult> {
    const url = this.createUrl('/sign-up');
    return this.client.post<IResult>(url, payload);
  }

  forgotPassword(payload: IForgotPasswordRequest): Observable<IResult> {
    const url = this.createUrl('/forgot-password');
    return this.client.post<IResult>(url, payload);
  }

  verifyForgotPasswordToken(
    params: IVerifyForgotPasswordRequest,
  ): Observable<IResult> {
    const url = this.createUrl(
      `/forgot-password/${params.userId}/${params.token}`,
    );
    return this.client.get<IResult>(url);
  }

  newPassword(payload: INewPasswordRequest): Observable<IResult> {
    const url = this.createUrl('/new-password');
    return this.client.put<IResult>(url, payload, {});
  }

  decodeToken(accessToken: string): IUserClaimsPrincipal | null {
    return jwtDecode<IUserClaimsPrincipal>(accessToken);
  }

  getUserClaimsPrincipal(): IUserClaimsPrincipal | null {
    const claims = localStorage.getItem(USER_DATA);
    if (!claims) return null;
    return JSON.parse(claims);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  setToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(
      USER_DATA,
      JSON.stringify(this.decodeToken(accessToken)),
    );
  }
}
