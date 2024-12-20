import { Injectable } from '@angular/core';
import { BaseService } from '@/core/abstractions';
import { map, Observable } from 'rxjs';
import {
  IDailyPostReportRequest,
  IDailyPostReportResponse,
  IDailyUserReportRequest,
  IDailyUserReportResponse,
  IPrefixReportResponse,
  IStatisticsResponse,
} from '@/shared/entities/report.entities';
import { IBaseResponse } from '@/core/models';

@Injectable({
  providedIn: 'root',
})
export class ReportService extends BaseService {
  constructor() {
    super();
  }

  statistics(metrics?: string[]): Observable<IStatisticsResponse> {
    this.setEndpoint('community', 'report');
    const url = this.createUrl('/statistics');
    return this.client
      .post<IBaseResponse<IStatisticsResponse>>(url, { metrics })
      .pipe(map((response) => response.data));
  }

  getPrefixReport(): Observable<IPrefixReportResponse[]> {
    this.setEndpoint('community', 'report');
    const url = this.createUrl('/prefix');
    return this.client
      .get<IBaseResponse<IPrefixReportResponse[]>>(url)
      .pipe(map((response) => response.data));
  }

  getDailyUserReport(
    params: IDailyUserReportRequest,
  ): Observable<IDailyUserReportResponse[]> {
    this.setEndpoint('identity', 'report');
    const url = this.createUrl('/daily-user');
    return this.client
      .get<
        IBaseResponse<IDailyUserReportResponse[]>
      >(url, { params: this.createParams(params) })
      .pipe(map((response) => response.data));
  }

  getDailyPostReport(
    params: IDailyPostReportRequest,
  ): Observable<IDailyPostReportResponse[]> {
    this.setEndpoint('community', 'report');
    const url = this.createUrl('/daily-post');
    return this.client
      .get<
        IBaseResponse<IDailyPostReportResponse[]>
      >(url, { params: this.createParams(params) })
      .pipe(map((response) => response.data));
  }
}
