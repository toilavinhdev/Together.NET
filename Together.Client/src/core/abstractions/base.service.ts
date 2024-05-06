import { Injectable } from '@angular/core';
import { environment } from '~env/environment';
import { HttpParams } from '@angular/common/http';
import { IBaseParams } from '~core/models';

@Injectable()
export class BaseService {
  private host = environment.baseUrl;
  private endpoint = '';

  constructor() {}

  protected setEndpoint(endpoint: string) {
    if (!endpoint.startsWith('/')) endpoint += '/';
    this.endpoint = `${this.host}/api${endpoint}`;
  }

  protected createUrl(path: string): string {
    if (!path.startsWith('/')) path = '/' + path;
    return `${this.endpoint}${path}`;
  }

  protected createParamsFromObject(objParams: IBaseParams): HttpParams {
    return Object.entries(objParams).reduce(
      (params, [key, value]) => params.set(key, value),
      new HttpParams(),
    );
  }
}
