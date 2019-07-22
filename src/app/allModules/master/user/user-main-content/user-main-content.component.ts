import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog, MatOption } from '@angular/material';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { AuthService } from 'app/services/auth.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { UserWithRole, RoleWithApp, AuthenticationDetails, Plant, DocumentTypeView } from 'app/models/master';

@Component({
  selector: 'user-main-content',
  templateUrl: './user-main-content.component.html',
  styleUrls: ['./user-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserMainContentComponent implements OnInit, OnChanges {

  @Input() currentSelectedUser: UserWithRole = new UserWithRole();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('allDocumentTypeSelected') private allDocumentTypeSelected: MatOption;
  @ViewChild('allPlantSelected') private allPlantSelected: MatOption;
  user: UserWithRole;
  UserType: any;
  userMainFormGroup: FormGroup;
  AllRoles: RoleWithApp[] = [];
  notificationSnackBarComponent: NotificationSnackBarComponent;
  // fileToUpload: File;
  // fileUploader: FileUploader;
  baseAddress: string;
  slectedProfile: Uint8Array;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  AllPlants: Plant[];
  AllDocumentTypes: DocumentTypeView[] = [];
  isAdministrator: boolean;

  constructor(private _masterService: MasterService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _authService: AuthService) {
    this.userMainFormGroup = this._formBuilder.group({
      userName: ['', Validators.required],
      userType: ['', Validators.required],
      roleID: ['', Validators.required],
      // plant: [''],
      // documentType: [''],
      // priority: [''],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern]],
      displayTitle: ['', Validators.required],
      reportingTo: [''],
      plantIDList: [[]],
      documentTypeIDList: [[]]
      // password: [''],
      // confirmPassword: [''],
      // password: ['', [Validators.required,
      // Validators.pattern('(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      // confirmPassword: ['', [Validators.required, confirmPasswordValidator]],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.user = new UserWithRole();
    this.authenticationDetails = new AuthenticationDetails();
    this.baseAddress = _authService.baseAddress;
    this.isAdministrator = true;
  }
  GetAllRoles(): void {
    this._masterService.GetAllRoles().subscribe(
      (data) => {
        this.AllRoles = <RoleWithApp[]>data;
        if (this.user && this.user.RoleID) {
          this.CheckIsAdministrator(this.user.RoleID);
        }
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetRoleName(RoleID: number): string {
    if (this.AllRoles) {
      const currentRole = this.AllRoles.filter(x => x.RoleID === RoleID)[0];
      if (currentRole) {
        return currentRole.RoleName;
      }
    }
    return '';
  }

  ngOnInit(): void {

    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllRoles();
    this.GetAllPlants();
    this.GetAllDocumentTypes();
  }

  GetAllPlants(): void {
    this._masterService.GetAllPlants().subscribe(
      (data) => {
        this.AllPlants = <Plant[]>data;
        this.OnPlantSelection();
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.log(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  GetAllDocumentTypes(): void {
    this._masterService.GetAllDocumentTypeViews().subscribe(
      (data) => {
        this.AllDocumentTypes = <DocumentTypeView[]>data;
        // console.log(this.AllMenuApps);
        this.OnDocumentTypeSelection();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ResetControl(): void {
    this.user = new UserWithRole();
    this.userMainFormGroup.reset();
    Object.keys(this.userMainFormGroup.controls).forEach(key => {
      // const control = this.userMainFormGroup.get(key);
      this.userMainFormGroup.get(key).markAsUntouched();
    });
    this.userMainFormGroup.get('reportingTo').patchValue('kailash.agrawal');
    // this.fileToUpload = null;
  }
  OnPlantSelection(): void {
    if (this.allPlantSelected) {
      if (this.allPlantSelected.selected) {
        this.allPlantSelected.deselect();
        // return false;
      }
      const selectedPlantIDs = this.userMainFormGroup.get('plantIDList').value;
      if (selectedPlantIDs && selectedPlantIDs.length > 0 && this.AllPlants && this.AllPlants.length > 0) {
        const result = this.AllPlants.filter(o1 => selectedPlantIDs.some(o2 => o1.Plant_ID === o2));
        if (result.length === this.AllPlants.length) {
          this.allPlantSelected.select();
        }
      }
    }
  }
  toggleAllPlantSelection(): void {
    if (this.allPlantSelected.selected) {
      // console.log([...this.AllDocumentTypes.map(item => item.Doc_Type_ID), 0]);
      this.userMainFormGroup.get('plantIDList')
        .patchValue([...this.AllPlants.map(item => item.Plant_ID), 0]);
    } else {
      this.userMainFormGroup.get('plantIDList').patchValue([]);
    }
  }
  OnDocumentTypeSelection(): void {
    if (this.allDocumentTypeSelected) {
      if (this.allDocumentTypeSelected.selected) {
        this.allDocumentTypeSelected.deselect();
        // return false;
      }
      const selectedDocIDs = this.userMainFormGroup.get('documentTypeIDList').value;
      if (selectedDocIDs && selectedDocIDs.length > 0 && this.AllDocumentTypes && this.AllDocumentTypes.length > 0) {
        const result = this.AllDocumentTypes.filter(o1 => selectedDocIDs.some(o2 => o1.Doc_Type_ID === o2));
        if (result.length === this.AllDocumentTypes.length) {
          this.allDocumentTypeSelected.select();
        }
      }
    }

    // if (this.userMainFormGroup.get('documentTypeIDList').value.length === this.AllDocumentTypes.length) {
    //   const selectedDocIDs = this.userMainFormGroup.get('documentTypeIDList').value;
    //   const result = this.AllDocumentTypes.filter(o1 => selectedDocIDs.some(o2 => o1.Doc_Type_ID === o2));
    //   // console.log(result);
    //   this.allDocumentTypeSelected.select();
    // }
  }
  toggleAllDocumentTypeSelection(): void {
    if (this.allDocumentTypeSelected.selected) {
      // console.log([...this.AllDocumentTypes.map(item => item.Doc_Type_ID), 0]);
      this.userMainFormGroup.get('documentTypeIDList')
        .patchValue([...this.AllDocumentTypes.map(item => item.Doc_Type_ID), 0]);
    } else {
      this.userMainFormGroup.get('documentTypeIDList').patchValue([]);
    }
  }

  // userTypeSelectionChange(val: string): void {
  //   console.log(val);
  //   if (val !== 'Himalaya email id user') {
  //     this.userMainFormGroup.get('password').setValidators([Validators.required,
  //     Validators.pattern('(?=.*[a-z].*[a-z].*[a-z])(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]);
  //     this.userMainFormGroup.get('password').updateValueAndValidity();
  //     this.userMainFormGroup.get('confirmPassword').setValidators([Validators.required, confirmPasswordValidator]);
  //     this.userMainFormGroup.get('confirmPassword').updateValueAndValidity();
  //   } else {
  //     this.userMainFormGroup.get('password').clearValidators();
  //     this.userMainFormGroup.get('password').updateValueAndValidity();
  //     this.userMainFormGroup.get('confirmPassword').clearValidators();
  //     this.userMainFormGroup.get('confirmPassword').updateValueAndValidity();
  //   }
  // }
  roleSelectionChange(event): void {
    // const target = event.source.selected._element.nativeElement;
    // console.log(target.innerText.trim());
    this.CheckIsAdministrator(event.value);
  }

  CheckIsAdministrator(val: any): void {
    if (this.AllRoles) {
      const SR: RoleWithApp = this.AllRoles.filter(x => x.RoleID === val)[0];
      if (SR) {
        if (SR.RoleName === 'Administrator') {
          this.isAdministrator = true;
          this.userMainFormGroup.get('plantIDList').clearValidators();
          this.userMainFormGroup.get('plantIDList').updateValueAndValidity();
          this.userMainFormGroup.get('plantIDList').patchValue([]);
          this.userMainFormGroup.get('documentTypeIDList').clearValidators();
          this.userMainFormGroup.get('documentTypeIDList').updateValueAndValidity();
          this.userMainFormGroup.get('documentTypeIDList').patchValue([]);
        } else {
          this.isAdministrator = false;
          this.userMainFormGroup.get('plantIDList').setValidators(Validators.required);
          this.userMainFormGroup.get('plantIDList').updateValueAndValidity();
          this.userMainFormGroup.get('documentTypeIDList').setValidators(Validators.required);
          this.userMainFormGroup.get('documentTypeIDList').updateValueAndValidity();
        }
      }
    }
  }

  SaveClicked(): void {
    if (this.userMainFormGroup.valid) {
      // const file: File = this.fileToUpload;
      if (this.user.UserID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'User'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user.UserName = this.userMainFormGroup.get('userName').value;
              this.user.UserType = this.userMainFormGroup.get('userType').value;
              this.user.RoleID = <number>this.userMainFormGroup.get('roleID').value;
              this.user.Email = this.userMainFormGroup.get('email').value;
              this.user.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
              // this.user.Plant = this.userMainFormGroup.get('plant').value;
              // this.user.DocumentType = this.userMainFormGroup.get('documentType').value;
              // this.user.Priority = this.userMainFormGroup.get('priority').value;
              this.user.DisplayTitle = this.userMainFormGroup.get('displayTitle').value;
              this.user.ReportingTo = this.userMainFormGroup.get('reportingTo').value;
              const selectedPlantIDs = this.userMainFormGroup.get('plantIDList').value;
              const indexp = selectedPlantIDs.indexOf(0);
              if (indexp > -1) {
                selectedPlantIDs.splice(indexp, 1);
              }
              this.user.Plant_ID_List = selectedPlantIDs;
              // this.user.Plant_ID_List = <string[]>this.userMainFormGroup.get('plantIDList').value;
              const selectedDocIDs = this.userMainFormGroup.get('documentTypeIDList').value;
              const index = selectedDocIDs.indexOf(0);
              if (index > -1) {
                selectedDocIDs.splice(index, 1);
              }
              this.user.DocumentType_ID_List = selectedDocIDs;
              // this.user.DocumentType_ID_List = <string[]>this.userMainFormGroup.get('documentTypeIDList').value;
              // this.user.Password = this.userMainFormGroup.get('password').value;
              this.user.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.UpdateUser(this.user).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('User updated successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          }
        );

      } else {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Create',
            Catagory: 'User'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user = new UserWithRole();
              this.user.UserName = this.userMainFormGroup.get('userName').value;
              this.user.UserType = this.userMainFormGroup.get('userType').value;
              this.user.RoleID = this.userMainFormGroup.get('roleID').value;
              this.user.Email = this.userMainFormGroup.get('email').value;
              this.user.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
              // this.user.Plant = this.userMainFormGroup.get('plant').value;
              // this.user.DocumentType = this.userMainFormGroup.get('documentType').value;
              // this.user.Priority = this.userMainFormGroup.get('priority').value;
              this.user.DisplayTitle = this.userMainFormGroup.get('displayTitle').value;
              this.user.ReportingTo = this.userMainFormGroup.get('reportingTo').value;
              const selectedPlantIDs = this.userMainFormGroup.get('plantIDList').value;
              const indexp = selectedPlantIDs.indexOf(0);
              if (indexp > -1) {
                selectedPlantIDs.splice(indexp, 1);
              }
              this.user.Plant_ID_List = selectedPlantIDs;
              // this.user.Plant_ID_List = <string[]>this.userMainFormGroup.get('plantIDList').value;
              const selectedDocIDs = this.userMainFormGroup.get('documentTypeIDList').value;
              const index = selectedDocIDs.indexOf(0);
              if (index > -1) {
                selectedDocIDs.splice(index, 1);
              }
              this.user.DocumentType_ID_List = selectedDocIDs;
              // this.user.Password = this.userMainFormGroup.get('password').value;
              this.user.CreatedBy = this.authenticationDetails.userName.toString();
              // this.user.Profile = this.slectedProfile;
              this._masterService.CreateUser(this.user).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('User created successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          });
      }
    } else {
      Object.keys(this.userMainFormGroup.controls).forEach(key => {
        this.userMainFormGroup.get(key).markAsTouched();
        this.userMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.userMainFormGroup.valid) {
      if (this.user.UserID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'User'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user.UserName = this.userMainFormGroup.get('userName').value;
              this.user.UserType = this.userMainFormGroup.get('userType').value;
              this.user.RoleID = <number>this.userMainFormGroup.get('roleID').value;
              this.user.Email = this.userMainFormGroup.get('email').value;
              this.user.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
              // this.user.Plant = this.userMainFormGroup.get('plant').value;
              // this.user.DocumentType = this.userMainFormGroup.get('documentType').value;
              // this.user.Priority = this.userMainFormGroup.get('priority').value;
              this.user.DisplayTitle = this.userMainFormGroup.get('displayTitle').value;
              this.user.ReportingTo = this.userMainFormGroup.get('reportingTo').value;
              const selectedPlantIDs = this.userMainFormGroup.get('plantIDList').value;
              const indexp = selectedPlantIDs.indexOf(0);
              if (indexp > -1) {
                selectedPlantIDs.splice(indexp, 1);
              }
              this.user.Plant_ID_List = selectedPlantIDs;
              // this.user.Plant_ID_List = <string[]>this.userMainFormGroup.get('plantIDList').value;
              const selectedDocIDs = this.userMainFormGroup.get('documentTypeIDList').value;
              const index = selectedDocIDs.indexOf(0);
              if (index > -1) {
                selectedDocIDs.splice(index, 1);
              }
              this.user.DocumentType_ID_List = selectedDocIDs;
              // this.user.DocumentType_ID_List = <string[]>this.userMainFormGroup.get('documentTypeIDList').value;
              // this.user.Password = this.userMainFormGroup.get('password').value;
              this.user.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.DeleteUser(this.user).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('User deleted successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          });
      }
    } else {
      Object.keys(this.userMainFormGroup.controls).forEach(key => {
        this.userMainFormGroup.get(key).markAsTouched();
        this.userMainFormGroup.get(key).markAsDirty();
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    // this.user = this.currentSelectedUser;
    if (this.currentSelectedUser) {
      this.user = new UserWithRole();
      this.user.UserID = this.currentSelectedUser.UserID;
      this.user.UserName = this.currentSelectedUser.UserName;
      this.user.UserType = this.currentSelectedUser.UserType;
      this.user.RoleID = this.currentSelectedUser.RoleID;
      this.user.Email = this.currentSelectedUser.Email;
      this.user.ContactNumber = this.currentSelectedUser.ContactNumber;
      this.user.Password = this.currentSelectedUser.Password;
      this.user.ReportingTo = this.currentSelectedUser.ReportingTo;
      this.user.Plant_ID_List = this.currentSelectedUser.Plant_ID_List;
      this.user.DocumentType_ID_List = this.currentSelectedUser.DocumentType_ID_List;
      this.user.DisplayTitle = this.currentSelectedUser.DisplayTitle;
      this.user.IsActive = this.currentSelectedUser.IsActive;
      this.user.CreatedBy = this.currentSelectedUser.CreatedBy;
      this.user.CreatedOn = this.currentSelectedUser.CreatedOn;
      this.user.ModifiedBy = this.currentSelectedUser.ModifiedBy;
      this.user.ModifiedOn = this.currentSelectedUser.ModifiedOn;
      this.userMainFormGroup.get('userName').patchValue(this.user.UserName);
      this.userMainFormGroup.get('userType').patchValue(this.user.UserType);
      this.userMainFormGroup.get('roleID').patchValue(this.user.RoleID);
      this.CheckIsAdministrator(this.user.RoleID);
      this.userMainFormGroup.get('email').patchValue(this.user.Email);
      this.userMainFormGroup.get('contactNumber').patchValue(this.user.ContactNumber);
      // this.userMainFormGroup.get('plant').patchValue(this.user.Plant);
      // this.userMainFormGroup.get('documentType').patchValue(this.user.DocumentType);
      // this.userMainFormGroup.get('priority').patchValue(this.user.Priority);
      this.userMainFormGroup.get('displayTitle').patchValue(this.user.DisplayTitle);
      this.userMainFormGroup.get('reportingTo').patchValue(this.user.ReportingTo);
      // console.log(this.user.Plant_ID_List);
      this.userMainFormGroup.get('plantIDList').patchValue(this.user.Plant_ID_List);
      this.userMainFormGroup.get('documentTypeIDList').patchValue(this.user.DocumentType_ID_List);
      this.OnDocumentTypeSelection();
      this.OnPlantSelection();
      // console.log(this.userMainFormGroup.get('plantIDList').value);
      // this.userMainFormGroup.get('password').patchValue(this.user.Password);
      // this.userMainFormGroup.get('confirmPassword').patchValue(this.user.Password);
    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

  // handleFileInput(evt): void {
  //   if (evt.target.files && evt.target.files.length > 0) {
  //     this.fileToUpload = evt.target.files[0];
  //   }
  // }
}


export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const confirmPassword = control.parent.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (confirmPassword.value === '') {
    return null;
  }

  if (password.value === confirmPassword.value) {
    return null;
  }

  return { 'passwordsNotMatching': true };
};





