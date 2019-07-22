import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { UserWithRole, AuthenticationDetails, UserPlantDocumentType } from 'app/models/master';

@Component({
  selector: 'user-plant-doctype',
  templateUrl: './user-plant-doctype.component.html',
  styleUrls: ['./user-plant-doctype.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserPlantDocTypeComponent implements OnInit {

  AllUsers: UserPlantDocumentType[] = [];
  SelectedUser: UserPlantDocumentType;
  authenticationDetails: AuthenticationDetails;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  MenuItems: string[];

  constructor(private _masterService: MasterService, private _router: Router, public snackBar: MatSnackBar) {
    this.authenticationDetails = new AuthenticationDetails();
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = true;
  }

  ngOnInit(): void {

    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.menuItemNames.split(',');
      if (this.MenuItems.indexOf('ConfigurationMaster') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }
      this.GetAllUserPlantDocumentTypes();
    } else {
      this._router.navigate(['/auth/login']);
    }

  }

  GetAllUserPlantDocumentTypes(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetAllUserPlantDocumentTypes().subscribe(
      (data) => {
        this.AllUsers = <UserPlantDocumentType[]>data;
        this.IsProgressBarVisibile = false;
        // console.log(this.AllUsers);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);      }
    );
  }
  OnUserSelectionChanged(selectedUser: UserPlantDocumentType): void {
    // console.log(selectedMenuApp);
    this.SelectedUser = selectedUser;
  }
  OnShowProgressBarEvent(status: string): void {
    if (status === 'show') {
      this.IsProgressBarVisibile = true;
    } else {
      this.IsProgressBarVisibile = false;
    }

  }

  RefreshAllUsers(msg: string): void {
    // console.log(msg);
    this.GetAllUserPlantDocumentTypes();
  }

}

