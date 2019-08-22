import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { RoleWithApp, UserPlantDocumentType } from 'app/models/master';
import { MasterService } from 'app/services/master.service';

@Component({
  selector: 'user-plant-doctype-side-bar',
  templateUrl: './user-plant-doctype-side-bar.component.html',
  styleUrls: ['./user-plant-doctype-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserPlantDocTypeSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  AllRoles: RoleWithApp[] = [];
  @Input() AllUsers: UserPlantDocumentType[] = [];
  @Output() UserSelectionChanged: EventEmitter<UserPlantDocumentType> = new EventEmitter<UserPlantDocumentType>();
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }
  ngOnInit(): void {
    // this.GetAllRoles();
  }
  // GetAllRoles(): void {
  //   this._masterService.GetAllRoles().subscribe(
  //     (data) => {
  //       this.AllRoles = <RoleWithApp[]>data;
  //       // console.log(this.AllMenuApps);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // GetRoleName(RoleID: number): string {
  //   if (this.AllRoles) {
  //     const currentRole = this.AllRoles.filter(x => x.RoleID === RoleID)[0];
  //     if (currentRole) {
  //       return currentRole.RoleName;
  //     }
  //   }
  //   return '';
  // }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllUsers.length > 0) {
      this.selectID = this.AllUsers[0].ID;
      this.loadSelectedUser(this.AllUsers[0]);
    }
  }

  loadSelectedUser(SelectedUser: UserPlantDocumentType): void {
    this.selectID = SelectedUser.ID;
    this.UserSelectionChanged.emit(SelectedUser);
    // console.log(SelectedMenuApp);
  }

  clearUser(): void {
    this.selectID = null;
    this.UserSelectionChanged.emit(null);
  }

}
