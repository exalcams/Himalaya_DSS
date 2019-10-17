import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationDetails, UserAudit, PlantView } from 'app/models/master';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { ReportService } from 'app/services/report.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'user-audit',
  templateUrl: './user-audit.component.html',
  styleUrls: ['./user-audit.component.scss']
})
export class UserAuditComponent implements OnInit {
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  UserEmailAddress: string;
  UserName: string;
  UserRole: string;
  IsProgressBarVisibile: boolean;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  UserAuditFormGroup: FormGroup;
  AllUserAudits: UserAudit[] = [];
  AllPlants: PlantView[] = [];

  UserAuditDataSource: MatTableDataSource<UserAudit>;
  UserAuditColumns: string[] = ['Plant_Name', 'UserName', 'Email', 'LoginTime', 'LogoutTime'];
  @ViewChild(MatPaginator) UserAuditPaginator: MatPaginator;
  @ViewChild(MatSort) UserAuditSort: MatSort;

  constructor(public _matDialog: MatDialog,
    private _reportService: ReportService,
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private _router: Router
  ) {
    this.UserAuditFormGroup = this._formBuilder.group({
      Plant: [''],
      LoginStatus: ['', Validators.required]
    });
    this.authenticationDetails = new AuthenticationDetails();
    this.IsProgressBarVisibile = true;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
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
      if (this.MenuItems.indexOf('UserAudit') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      } else {
        this.UserEmailAddress = this.authenticationDetails.emailAddress;
        this.UserName = this.authenticationDetails.userName;
        this.UserRole = this.authenticationDetails.userRole;
        this.UserAuditFormGroup.get('LoginStatus').patchValue('loggedin');
        this.GetAllPlants();
        this.GetAllLoginUserAudits();
      }
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  ResetControl(): void {
    this.UserAuditFormGroup.reset();
    Object.keys(this.UserAuditFormGroup.controls).forEach(key => {
      this.UserAuditFormGroup.get(key).markAsUntouched();
    });
  }

  GetAllPlants(): void {
    this._masterService.GetAllPlantViews().subscribe(
      (data) => {
        this.AllPlants = data as PlantView[];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Administrator
  GetAllLoginUserAudits(): void {
    this._reportService.GetAllLoginUserAudits().subscribe(
      (data) => {
        this.AllUserAudits = data as UserAudit[];
        this.UserAuditDataSource = new MatTableDataSource(this.AllUserAudits);
        this.UserAuditDataSource.paginator = this.UserAuditPaginator;
        this.UserAuditDataSource.sort = this.UserAuditSort;
        this.IsProgressBarVisibile = false;
      }, (error) => {
        console.error(error);
        this.IsProgressBarVisibile = false;
      }
    );
  }

  GetUserAuditBasedOnCondition(): void {
    if (this.UserAuditFormGroup.valid) {
      this.IsProgressBarVisibile = true;
      const Plant = this.UserAuditFormGroup.get('Plant').value;
      const LoginStatus = this.UserAuditFormGroup.get('LoginStatus').value;
      this._reportService.GetUserAuditBasedOnCondition(Plant, LoginStatus)
        .subscribe((data) => {
          this.AllUserAudits = data as UserAudit[];
          this.UserAuditDataSource = new MatTableDataSource(this.AllUserAudits);
          this.UserAuditDataSource.paginator = this.UserAuditPaginator;
          this.UserAuditDataSource.sort = this.UserAuditSort;
          this.IsProgressBarVisibile = false;
        }, (error) => {
          console.error(error);
          this.IsProgressBarVisibile = false;
        }
        );
    } else {
      Object.keys(this.UserAuditFormGroup.controls).forEach(key => {
        this.UserAuditFormGroup.get(key).markAsTouched();
        this.UserAuditFormGroup.get(key).markAsDirty();
      });
    }
  }

  applyFilter(filterValue: string): void {
    this.UserAuditDataSource.filter = filterValue.trim().toLowerCase();

    if (this.UserAuditDataSource.paginator) {
      this.UserAuditDataSource.paginator.firstPage();
    }

  }
}

