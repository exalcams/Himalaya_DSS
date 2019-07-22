import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { DSSConfiguration, DSSInvoice, DSSStatusCount, CertificateClass, DSSErrorInvoice, UserByPlant, ErrorInvoice } from 'app/models/dss';
import { catchError } from 'rxjs/operators';
import { UserLoginHistory, LoginHistoryFilter } from 'app/models/master';

@Injectable()
export class ReportService {
  baseUrl: string;


  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseUrl = _authService.baseAddress;
  }


  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error.error_description || error.error || error.message || 'Server Error');
  }
  GetAllUserLoginHistories(): Observable<UserLoginHistory[] | string> {
    return this._httpClient.get<UserLoginHistory[]>(`${this.baseUrl}api/Reports/GetAllUserLoginHistories`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllUserLoginHistoriesBasedOnDate(loginHistoryFilter: LoginHistoryFilter): Observable<UserLoginHistory[] | string> {
    return this._httpClient.post<UserLoginHistory[]>(`${this.baseUrl}api/Reports/GetAllUserLoginHistoriesBasedOnDate`,
      loginHistoryFilter,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllUserLoginHistoriesByUser(UserName: string): Observable<UserLoginHistory[] | string> {
    return this._httpClient.get<UserLoginHistory[]>(`${this.baseUrl}api/Reports/GetAllUserLoginHistoriesByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllUserLoginHistoriesBasedOnDateByUser(loginHistoryFilter: LoginHistoryFilter): Observable<UserLoginHistory[] | string> {
    return this._httpClient.post<UserLoginHistory[]>(`${this.baseUrl}api/Reports/GetAllUserLoginHistoriesBasedOnDateByUser`,
      loginHistoryFilter,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

}
