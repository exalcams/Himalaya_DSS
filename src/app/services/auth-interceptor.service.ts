import { Injectable, Compiler } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationDetails } from 'app/models/master';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    authenticationDetails: AuthenticationDetails;
    baseAddress: string;
    notificationSnackBarComponent: NotificationSnackBarComponent;
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _compiler: Compiler,
        public snackBar: MatSnackBar,
    ) {
        this.authenticationDetails = new AuthenticationDetails();
        this.baseAddress = this._authService.baseAddress;
        this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | any {
        if (!request.url.includes('SignOut')) {
            const retrievedObject = localStorage.getItem('authorizationData');
            if (retrievedObject) {
                this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
                // console.log(this.authenticationDetails.expires);
                if (this.authenticationDetails.expires) {
                    const expires = this.authenticationDetails.expires;
                    const ExpiryDate = new Date(expires);
                    const today = new Date();
                    if (today > ExpiryDate) {
                        // console.log('expired');
                        const UserID = this.authenticationDetails.userID;
                        this._authService.SignOut(this.authenticationDetails.userID).subscribe(
                            (data) => {
                                localStorage.removeItem('authorizationData');
                                localStorage.removeItem('menuItemsData');
                                this._compiler.clearCache();
                                this._router.navigate(['auth/login']);
                                console.error('Session expired , please login again');
                                this.notificationSnackBarComponent.openSnackBar('Session expired , please login again', SnackBarStatus.danger);
                            },
                            (err) => {
                                console.error(err);
                                // this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                                localStorage.removeItem('authorizationData');
                                localStorage.removeItem('menuItemsData');
                                this._compiler.clearCache();
                                this._router.navigate(['auth/login']);
                                console.error('Session expired , please login again');
                                this.notificationSnackBarComponent.openSnackBar('Session expired , please login again', SnackBarStatus.danger);
                            }
                        );
                        return EMPTY;
                    }
                }

            }
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }
}
