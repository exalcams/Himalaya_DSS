import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { _MatChipListMixinBase } from '@angular/material';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { MenuApp, RoleWithApp, UserWithRole, UserNotification, DocumentTypes, OutputType, UserPlantDocumentType, Plant, Priority, PriorityView, PlantView, DocumentTypeView, OutputTypeView, DocumentOutputType, DocumentOutputTypeMapView, UserPlantMapView } from 'app/models/master';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  baseAddress: string;
  NotificationEvent: Subject<any>;

  GetNotification(): Observable<any> {
    return this.NotificationEvent.asObservable();
  }

  TriggerNotification(eventName: string): void {
    this.NotificationEvent.next(eventName);
  }

  constructor(private _httpClient: HttpClient, private _authService: AuthService) {
    this.baseAddress = _authService.baseAddress;
    this.NotificationEvent = new Subject();
  }

  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }

  // App
  CreateMenuApp(menuApp: MenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateApp`,
      menuApp,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllMenuApp(): Observable<MenuApp[] | string> {
    return this._httpClient.get<MenuApp[]>(`${this.baseAddress}api/Master/GetAllApps`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateMenuApp(menuApp: MenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateApp`,
      menuApp,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteMenuApp(menuApp: MenuApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteApp`,
      menuApp,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Role
  CreateRole(role: RoleWithApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateRole`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  GetAllRoles(): Observable<RoleWithApp[] | string> {
    return this._httpClient.get<RoleWithApp[]>(`${this.baseAddress}api/Master/GetAllRoles`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateRole(role: RoleWithApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateRole`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteRole(role: RoleWithApp): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteRole`,
      role,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Users

  CreateUser1(user: UserWithRole, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('uploadFile', file, file.name);
    formData.append('userName', user.UserName);

    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateUser1`,
      formData,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    )
      .pipe(catchError(this.errorHandler));
  }

  CreateUser(user: UserWithRole): Observable<any> {

    // const formData: FormData = new FormData();
    // if (selectedFile) {
    //   formData.append('selectedFile', selectedFile, selectedFile.name);
    // }
    // // formData.append('UserID', user.UserID.toString());
    // formData.append('UserName', user.UserName);
    // formData.append('DocumentType', user.DocumentType);
    // formData.append('Plant', user.Plant);
    // formData.append('DisplayTitle', user.DisplayTitle);
    // formData.append('Priority', user.Priority);
    // formData.append('Email', user.Email);
    // formData.append('ContactNumber', user.ContactNumber);
    // formData.append('Password', user.Password);
    // formData.append('RoleID', user.RoleID.toString());
    // formData.append('CreatedBy', user.CreatedBy);

    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateUser`,
      user,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  GetAllUsers(): Observable<UserWithRole[] | string> {
    return this._httpClient.get<UserWithRole[]>(`${this.baseAddress}api/Master/GetAllUsers`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllNormalUsers(): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Master/GetAllNormalUsers`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllNormalUsersByUser(UserName: string): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Master/GetAllNormalUsersByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllUserPlantMapViews(): Observable<UserPlantMapView[] | string> {
    return this._httpClient.get<UserPlantMapView[]>(`${this.baseAddress}api/Master/GetAllUserPlantMapViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllUserPlantMapViewsByUser(UserName:string): Observable<UserPlantMapView[] | string> {
    return this._httpClient.get<UserPlantMapView[]>(`${this.baseAddress}api/Master/GetAllUserPlantMapViewsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }


  UpdateUser(user: UserWithRole): Observable<any> {
    // const formData: FormData = new FormData();
    // if (selectedFile) {
    //   formData.append('selectedFile', selectedFile, selectedFile.name);
    // }
    // formData.append('UserID', user.UserID.toString());
    // formData.append('UserName', user.UserName);
    // formData.append('DocumentType', user.DocumentType);
    // formData.append('Plant', user.Plant);
    // formData.append('DisplayTitle', user.DisplayTitle);
    // formData.append('Priority', user.Priority);
    // formData.append('Email', user.Email);
    // formData.append('ContactNumber', user.ContactNumber);
    // formData.append('Password', user.Password);
    // formData.append('RoleID', user.RoleID.toString());
    // formData.append('CreatedBy', user.CreatedBy);
    // formData.append('ModifiedBy', user.ModifiedBy);
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateUser`,
      user,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  DeleteUser(user: UserWithRole): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteUser`,
      user,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // UserPlantDocumentType

  CreateUserPlantDocumentType(userPlantDocumentType: UserPlantDocumentType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateUserPlantDocumentType`,
      userPlantDocumentType,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  GetAllUserPlantDocumentTypes(): Observable<UserPlantDocumentType[] | string> {
    return this._httpClient.get<UserPlantDocumentType[]>(`${this.baseAddress}api/Master/GetAllUserPlantDocumentTypes`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateUserPlantDocumentType(userPlantDocumentType: UserPlantDocumentType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateUserPlantDocumentType`,
      userPlantDocumentType,
      // {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json'
      //   })
      // }
    ).pipe(catchError(this.errorHandler));

  }

  DeleteUserPlantDocumentType(userPlantDocumentType: UserPlantDocumentType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteUserPlantDocumentType`,
      userPlantDocumentType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Priority

  CreatePriority(priority: Priority): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreatePriority`,
      priority,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllPriorities(): Observable<Priority[] | string> {
    return this._httpClient.get<Priority[]>(`${this.baseAddress}api/Master/GetAllPriorities`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllPriorityViews(): Observable<PriorityView[] | string> {
    return this._httpClient.get<PriorityView[]>(`${this.baseAddress}api/Master/GetAllPriorityViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllPriorityNames(): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Master/GetAllPriorityNames`)
      .pipe(catchError(this.errorHandler));
  }

  UpdatePriority(priority: Priority): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdatePriority`,
      priority,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeletePriority(priority: Priority): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeletePriority`,
      priority,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Plant

  CreatePlant(plant: Plant): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreatePlant`,
      plant,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllPlants(): Observable<Plant[] | string> {
    return this._httpClient.get<Plant[]>(`${this.baseAddress}api/Master/GetAllPlants`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllPlantViews(): Observable<PlantView[] | string> {
    return this._httpClient.get<PlantView[]>(`${this.baseAddress}api/Master/GetAllPlantViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllPlantViewsByUser(UserName: string): Observable<PlantView[] | string> {
    return this._httpClient.get<PlantView[]>(`${this.baseAddress}api/Master/GetAllPlantViewsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }


  GetAllPlantNames(): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Master/GetAllPlantNames`)
      .pipe(catchError(this.errorHandler));
  }

  UpdatePlant(plant: Plant): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdatePlant`,
      plant,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeletePlant(plant: Plant): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeletePlant`,
      plant,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }



  // Document Type

  CreateDocumentType(documentType: DocumentOutputType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateDocumentType`,
      documentType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllDocumentTypes(): Observable<DocumentOutputType[] | string> {
    return this._httpClient.get<DocumentOutputType[]>(`${this.baseAddress}api/Master/GetAllDocumentTypes`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllDocumentTypeViews(): Observable<DocumentTypeView[] | string> {
    return this._httpClient.get<DocumentTypeView[]>(`${this.baseAddress}api/Master/GetAllDocumentTypeViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllDocumentTypeViewsByUser(UserName: string): Observable<DocumentTypeView[] | string> {
    return this._httpClient.get<DocumentTypeView[]>(`${this.baseAddress}api/Master/GetAllDocumentTypeViewsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllDocumentOutputTypeMapViews(): Observable<DocumentOutputTypeMapView[] | string> {
    return this._httpClient.get<DocumentOutputTypeMapView[]>(`${this.baseAddress}api/Master/GetAllDocumentOutputTypeMapViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllDocumentOutputTypeMapViewsByUser(UserName: string): Observable<DocumentOutputTypeMapView[] | string> {
    return this._httpClient.get<DocumentOutputTypeMapView[]>(`${this.baseAddress}api/Master/GetAllDocumentOutputTypeMapViewsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllDocumentTypeNames(): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Master/GetAllDocumentTypeNames`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateDocumentType(documentType: DocumentOutputType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateDocumentType`,
      documentType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteDocumentType(documentType: DocumentTypes): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteDocumentType`,
      documentType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  // Output Type

  CreateOutputType(outputType: OutputType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/CreateOutputType`,
      outputType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllOutputTypes(): Observable<OutputType[] | string> {
    return this._httpClient.get<OutputType[]>(`${this.baseAddress}api/Master/GetAllOutputTypes`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllOutputTypeViews(): Observable<OutputTypeView[] | string> {
    return this._httpClient.get<OutputTypeView[]>(`${this.baseAddress}api/Master/GetAllOutputTypeViews`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllOutputTypeViewsByUser(UserName: string): Observable<OutputTypeView[] | string> {
    return this._httpClient.get<OutputTypeView[]>(`${this.baseAddress}api/Master/GetAllOutputTypeViewsByUser?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  GetAllOutputTypeNames(): Observable<string[] | string> {
    return this._httpClient.get<string[]>(`${this.baseAddress}api/Master/GetAllOutputTypeNames`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateOutputType(outputType: OutputType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/UpdateOutputType`,
      outputType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  DeleteOutputType(outputType: OutputType): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Master/DeleteOutputType`,
      outputType,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

  GetAllNotificationByUserID(UserID: string): Observable<UserNotification[] | string> {
    return this._httpClient.get<UserNotification[]>(`${this.baseAddress}api/Notification/GetAllNotificationByUserID?UserID=${UserID}`)
      .pipe(catchError(this.errorHandler));
  }

  UpdateNotification(SelectedNotification: UserNotification): Observable<any> {
    return this._httpClient.post<any>(`${this.baseAddress}api/Notification/UpdateNotification`,
      SelectedNotification, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.errorHandler));
  }

}
