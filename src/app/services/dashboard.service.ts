import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { FilterClass, DSSConfiguration, DSSInvoice, DSSStatusCount, CertificateClass, DSSErrorInvoice, UserByPlant, ErrorInvoice } from 'app/models/dss';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DashboardService {
  baseUrl: string;
  projects: any[];
  widgets: any[];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseUrl = _authService.baseAddress;
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getProjects(),
        this.getWidgets()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get projects
   *
   * @returns {Promise<any>}
   */
  getProjects(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/project-dashboard-projects')
        .subscribe((response: any) => {
          this.projects = response;
          resolve(response);
        }, reject);
    });
  }

  /**
   * Get widgets
   *
   * @returns {Promise<any>}
   */
  getWidgets(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/project-dashboard-widgets')
        .subscribe((response: any) => {
          this.widgets = response;
          resolve(response);
        }, reject);
    });
  }
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error.error_description || error.error || error.message || 'Server Error');
  }
  GetDSSStatusCounts(): Observable<DSSStatusCount | string> {
    return this._httpClient.get<DSSStatusCount>(`${this.baseUrl}api/ESigner/GetDSSStatusCounts`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllSignedDocument(): Observable<DSSInvoice[] | string> {
    return this._httpClient.get<DSSInvoice[]>(`${this.baseUrl}api/ESigner/GetAllSignedDocuments`)
      .pipe(catchError(this.errorHandler));
  }
  // GetAllInvoicesBasedOnDate(DocumentTypeName: string, FROMDATE: string, TODATE: string): Observable<DSSInvoice[] | string> {
  // GetAllInvoicesBasedOnDate(getDocument: FilterClass): Observable<DSSInvoice[] | string> {
  //   return this._httpClient.post<DSSInvoice[]>(`${this.baseUrl}api/ESigner/GetAllInvoicesBasedOnDate`,
  //     getDocument,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }
  GetAllInvoicesBasedOnDate(getDocument: FilterClass): Observable<DSSInvoice[] | string> {
    let url = `${this.baseUrl}api/ESigner/GetAllInvoicesBasedOnDate?`;
    url += `FromDate=${getDocument.FromDate}&ToDate=${getDocument.ToDate}`;
    url += getDocument.FromInvoice ? `&FromInvoice=${getDocument.FromInvoice}` : '';
    url += getDocument.ToInvoice ? `&ToInvoice=${getDocument.ToInvoice}` : '';
    url += getDocument.Plant_ID ? `&Plant_ID=${getDocument.Plant_ID}` : '';
    url += getDocument.DocumentType_ID ? `&DocumentType_ID=${getDocument.DocumentType_ID}` : '';
    url += getDocument.OutputType_ID ? `&OutputType_ID=${getDocument.OutputType_ID}` : '';
    url += getDocument.Authority ? `&Authority=${getDocument.Authority}` : '';
    return this._httpClient.get<DSSInvoice[]>(url)
      .pipe(catchError(this.errorHandler));
  }
  GetAllExpiredCertificates(): Observable<DSSConfiguration[] | string> {
    return this._httpClient.get<DSSConfiguration[]>(`${this.baseUrl}api/ESigner/GetAllExpiredCertificates`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllCertificateFromStore(): Observable<CertificateClass[] | string> {
    return this._httpClient.get<CertificateClass[]>(`${this.baseUrl}api/ESigner/GetAllCertificateFromStore`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllUserEmails(): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseUrl}api/ESigner/GetAllUserEmails`)
      .pipe(catchError(this.errorHandler));
  }
  // GetAllPlants(): Observable<string[] | string> {
  //   return this._httpClient.get<string[]>(`${this.baseUrl}api/ESigner/GetAllPlants`)
  //     .pipe(catchError(this.errorHandler));
  // }
  GetAllUsersByPlant(): Observable<UserByPlant[] | string> {
    return this._httpClient.get<UserByPlant[]>(`${this.baseUrl}api/ESigner/GetAllUsersByPlant`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllUsersByUser(UserName: string): Observable<UserByPlant[] | string> {
    return this._httpClient.get<UserByPlant[]>(`${this.baseUrl}api/ESigner/GetAllUsersByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }
  // GetAllPlantUsersByUser(UserName: string): Observable<string[] | string> {
  //   return this._httpClient.get<string[]>(`${this.baseUrl}api/ESigner/GetAllPlantUsersByUser?UserName=${UserName}`)
  //     .pipe(catchError(this.errorHandler));
  // }

  CreateConfiguration(DSSConfig: DSSConfiguration): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}api/ESigner/CreateConfiguration`,
      DSSConfig,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  UpdateConfiguration(DSSConfig: DSSConfiguration): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}api/ESigner/UpdateConfiguration`,
      DSSConfig,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteConfiguration(DSSConfig: DSSConfiguration): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}api/ESigner/DeleteConfiguration`,
      DSSConfig,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }
  ActivateConfiguration(DSSConfig: DSSConfiguration): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}api/ESigner/ActivateConfiguration`,
      DSSConfig,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllConfigurations(): Observable<DSSConfiguration[] | string> {
    return this._httpClient.get<DSSConfiguration[]>(`${this.baseUrl}api/ESigner/GetAllConfigurations`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllErrorDocuments(): Observable<ErrorInvoice[] | string> {
    return this._httpClient.get<ErrorInvoice[]>(`${this.baseUrl}api/ESigner/GetAllErrorDocuments`)
      .pipe(catchError(this.errorHandler));
  }
  GetDSSStatusCountsByUser(UserName: string): Observable<DSSStatusCount | string> {
    return this._httpClient.get<DSSStatusCount>(`${this.baseUrl}api/ESigner/GetDSSStatusCountsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllSignedDocumentsByUser(UserName: string): Observable<DSSInvoice[] | string> {
    return this._httpClient.get<DSSInvoice[]>(`${this.baseUrl}api/ESigner/GetAllSignedDocumentsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }
  // GetAllInvoicesBasedOnDateByUser(DocumentTypeName: string, FROMDATE: string, TODATE: string, UserName: string): Observable<DSSInvoice[] | string> {
  // GetAllInvoicesBasedOnDateByUser(getDocument: FilterClass): Observable<DSSInvoice[] | string> {
  //   return this._httpClient.post<DSSInvoice[]>(`${this.baseUrl}api/ESigner/GetAllInvoicesBasedOnDateByUser`,
  //     getDocument,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }
  GetAllInvoicesBasedOnDateByUser(getDocument: FilterClass): Observable<DSSInvoice[] | string> {
    let url = `${this.baseUrl}api/ESigner/GetAllInvoicesBasedOnDateByUser?`;
    url += `UserName=${getDocument.UserName}&FromDate=${getDocument.FromDate}&ToDate=${getDocument.ToDate}`;
    url += getDocument.FromInvoice ? `&FromInvoice=${getDocument.FromInvoice}` : '';
    url += getDocument.ToInvoice ? `&ToInvoice=${getDocument.ToInvoice}` : '';
    url += getDocument.Plant_ID ? `&Plant_ID=${getDocument.Plant_ID}` : '';
    url += getDocument.DocumentType_ID ? `&DocumentType_ID=${getDocument.DocumentType_ID}` : '';
    url += getDocument.OutputType_ID ? `&OutputType_ID=${getDocument.OutputType_ID}` : '';
    url += getDocument.Authority ? `&Authority=${getDocument.Authority}` : '';
    return this._httpClient.get<DSSInvoice[]>(url)
      .pipe(catchError(this.errorHandler));
  }
  GetAllExpiredCertificatesByUser(UserName: string): Observable<DSSConfiguration[] | string> {
    return this._httpClient.get<DSSConfiguration[]>(`${this.baseUrl}api/ESigner/GetAllExpiredCertificatesByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllConfigurationsByUser(UserName: string): Observable<DSSConfiguration[] | string> {
    return this._httpClient.get<DSSConfiguration[]>(`${this.baseUrl}api/ESigner/GetAllConfigurationsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateAllConfigurationsByUser(UserName: string, SignedAuthority: string): Observable<string> {
    return this._httpClient.get<string>(`${this.baseUrl}api/ESigner/UpdateAllConfigurationsByUser?UserName=${UserName}&SignedAuthority=${SignedAuthority}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllErrorDocumentsByUser(UserName: string): Observable<ErrorInvoice[] | string> {
    return this._httpClient.get<ErrorInvoice[]>(`${this.baseUrl}api/ESigner/GetAllErrorDocumentsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }
  // GetAllDocumentTypes(): Observable<string[] | string> {
  //   return this._httpClient.get<string[]>(`${this.baseUrl}api/ESigner/GetAllDocumentTypes`)
  //     .pipe(catchError(this.errorHandler));
  // }


  DowloandPdfFromID(ID: number): Observable<Blob | string> {
    return this._httpClient.get(`${this.baseUrl}api/ESigner/DowloandPdfFromID?ID=${ID}`, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    })
      .pipe(catchError(this.errorHandler));
  }

}
