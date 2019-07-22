import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { UserLoginHistory, LoginHistoryFilter, AuthenticationDetails } from 'app/models/master';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { ReportService } from 'app/services/report.service';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Component({
  selector: 'login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginHistoryComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  UserEmailAddress: string;
  UserName: string;
  UserRole: string;
  IsProgressBarVisibile: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  loginHistoryFormGroup: FormGroup;
  loginHistoryFilter: LoginHistoryFilter;
  AllUserLoginHistories: UserLoginHistory[] = [];
  isDateError: boolean;

  LoginHistoryDataSource: MatTableDataSource<UserLoginHistory>;
  LoginHistoryColumns: string[] = ['UserName', 'LoginTime', 'LogoutTime'];
  @ViewChild(MatPaginator) LoginHistoryPaginator: MatPaginator;
  @ViewChild(MatSort) LoginHistorySort: MatSort;

  constructor(public _matDialog: MatDialog,
    private _reportService: ReportService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _router: Router
  ) {
    this.loginHistoryFormGroup = this._formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    this.authenticationDetails = new AuthenticationDetails();
    this.IsProgressBarVisibile = true;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.isDateError = false;

  }

  ngOnInit(): void {
    // Retrive authorizationData
    this.UserEmailAddress = '';
    this.UserName = '';
    this.UserRole = '';
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('LoginHistory') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      } else {
        this.UserEmailAddress = this.authenticationDetails.emailAddress;
        this.UserName = this.authenticationDetails.userName;
        this.UserRole = this.authenticationDetails.userRole;
        if (this.UserRole === 'Administrator') {
          this.GetAllUserLoginHistories();
        } else {
          this.GetAllUserLoginHistoriesByUser();
        }
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  ResetControl(): void {
    this.loginHistoryFilter = new LoginHistoryFilter();
    this.loginHistoryFormGroup.reset();
    Object.keys(this.loginHistoryFormGroup.controls).forEach(key => {
      this.loginHistoryFormGroup.get(key).markAsUntouched();
    });
  }

  // Administrator
  GetAllUserLoginHistories(): void {
    this._reportService.GetAllUserLoginHistories().subscribe(
      (data) => {
        this.AllUserLoginHistories = data as UserLoginHistory[];
        this.LoginHistoryDataSource = new MatTableDataSource(this.AllUserLoginHistories);
        this.LoginHistoryDataSource.paginator = this.LoginHistoryPaginator;
        this.LoginHistoryDataSource.sort = this.LoginHistorySort;
        this.IsProgressBarVisibile = false;
      }, (error) => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetAllUserLoginHistoriesByUser(): void {
    this._reportService.GetAllUserLoginHistoriesByUser(this.UserName).subscribe(
      (data) => {
        this.AllUserLoginHistories = data as UserLoginHistory[];
        this.LoginHistoryDataSource = new MatTableDataSource(this.AllUserLoginHistories);
        this.LoginHistoryDataSource.paginator = this.LoginHistoryPaginator;
        this.LoginHistoryDataSource.sort = this.LoginHistorySort;
        this.IsProgressBarVisibile = false;
      }, (error) => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetAllUserLoginHistoriesBasedOnDate(): void {
    if (this.loginHistoryFormGroup.valid) {
      if (!this.isDateError) {
        this.IsProgressBarVisibile = true;
        this.loginHistoryFilter = new LoginHistoryFilter();
        // this.getDocument.DocumentTypeName = this.documentFormGroup.get('DocumentTypeName').value;
        this.loginHistoryFilter.FromDate = this.datePipe.transform(this.loginHistoryFormGroup.get('fromDate').value as Date, 'yyyy-MM-dd');
        this.loginHistoryFilter.ToDate = this.datePipe.transform(this.loginHistoryFormGroup.get('toDate').value as Date, 'yyyy-MM-dd');
        if (this.UserRole === 'Administrator') {
          this._reportService.GetAllUserLoginHistoriesBasedOnDate(this.loginHistoryFilter)
            .subscribe((data) => {
              this.AllUserLoginHistories = data as UserLoginHistory[];
              this.LoginHistoryDataSource = new MatTableDataSource(this.AllUserLoginHistories);
              this.LoginHistoryDataSource.paginator = this.LoginHistoryPaginator;
              this.LoginHistoryDataSource.sort = this.LoginHistorySort;
              this.IsProgressBarVisibile = false;
            }, (error) => {
              console.error(error);
              this.IsProgressBarVisibile = false;
            }
            );
        } else {
          this.loginHistoryFilter.UserName = this.UserName;
          this._reportService.GetAllUserLoginHistoriesBasedOnDateByUser(this.loginHistoryFilter)
            .subscribe((data) => {
              this.AllUserLoginHistories = data as UserLoginHistory[];
              this.LoginHistoryDataSource = new MatTableDataSource(this.AllUserLoginHistories);
              this.LoginHistoryDataSource.paginator = this.LoginHistoryPaginator;
              this.LoginHistoryDataSource.sort = this.LoginHistorySort;
              this.IsProgressBarVisibile = false;
            }, (error) => {
              console.error(error);
              this.IsProgressBarVisibile = false;
            }
            );
        }

      }
    } else {
      Object.keys(this.loginHistoryFormGroup.controls).forEach(key => {
        this.loginHistoryFormGroup.get(key).markAsTouched();
        this.loginHistoryFormGroup.get(key).markAsDirty();
      });
    }
  }
  onKeydown(event): boolean {
    // console.log(event.key);
    if (event.key === 'Backspace' || event.key === 'Delete') {
      return true;
    } else {
      return false;
    }
  }
  DateSelected(): void {
    const FROMDATEVAL = this.loginHistoryFormGroup.get('fromDate').value as Date;
    const TODATEVAL = this.loginHistoryFormGroup.get('toDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isDateError = true;
    } else {
      this.isDateError = false;
    }
  }
  applyFilter(filterValue: string): void {
    this.LoginHistoryDataSource.filter = filterValue.trim().toLowerCase();

    if (this.LoginHistoryDataSource.paginator) {
      this.LoginHistoryDataSource.paginator.firstPage();
    }

  }
}
