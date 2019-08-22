import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { AuthService } from 'app/services/auth.service';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { AuthenticationDetails, UserPlantDocumentType, DocumentTypeView, PlantView, PriorityView } from 'app/models/master';

@Component({
  selector: 'user-plant-doctype-main-content',
  templateUrl: './user-plant-doctype-main-content.component.html',
  styleUrls: ['./user-plant-doctype-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserPlantDocTypeMainContentComponent implements OnInit, OnChanges {

  @Input() currentSelectedUser: UserPlantDocumentType = new UserPlantDocumentType();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  user: UserPlantDocumentType;
  userConfigMainFormGroup: FormGroup;
  AllNormalUsers: string[] = [];
  AllPlantViews: PlantView[] = [];
  AllPriorityViews: PriorityView[] = [];
  AllDocumentTypeViews: DocumentTypeView[] = [];

  notificationSnackBarComponent: NotificationSnackBarComponent;
  baseAddress: string;
  slectedProfile: Uint8Array;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];

  constructor(private _masterService: MasterService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    _authService: AuthService) {
    this.userConfigMainFormGroup = this._formBuilder.group({
      userName: ['', Validators.required],
      plant: ['', Validators.required],
      documentType: ['', Validators.required],
      priority: ['', Validators.required],
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.user = new UserPlantDocumentType();
    this.authenticationDetails = new AuthenticationDetails();
    this.baseAddress = _authService.baseAddress;
  }


  ngOnInit(): void {

    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;

    } else {
      this._router.navigate(['/auth/login']);
    }
    this.GetAllPlantViews();
    this.GetAllDocumentTypeViews();
    this.GetAllPriorityViews();
    this.GetAllNormalUsers();

  }

  ResetControl(): void {
    this.user = new UserPlantDocumentType();
    this.userConfigMainFormGroup.reset();
    Object.keys(this.userConfigMainFormGroup.controls).forEach(key => {
      // const control = this.userMainFormGroup.get(key);
      this.userConfigMainFormGroup.get(key).markAsUntouched();
    });
    // this.fileToUpload = null;
  }

  GetAllNormalUsers(): void {
    this._masterService.GetAllNormalUsers().subscribe(
      (data) => {
        this.AllNormalUsers = <string[]>data;
        // console.log(this.AllUsers);
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllPriorityViews(): void {
    this._masterService.GetAllPriorityViews().subscribe(
      (data) => {
        this.AllPriorityViews = <PriorityView[]>data;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllPlantViews(): void {
    this._masterService.GetAllPlantViews().subscribe(
      (data) => {
        this.AllPlantViews = <PlantView[]>data;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  GetAllDocumentTypeViews(): void {
    this._masterService.GetAllDocumentTypeViews().subscribe(
      (data) => {
        this.AllDocumentTypeViews = <DocumentTypeView[]>data;
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  SaveClicked(): void {
    if (this.userConfigMainFormGroup.valid) {
      // const file: File = this.fileToUpload;
      if (this.user.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'User Config'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user.UserName = this.userConfigMainFormGroup.get('userName').value;
              this.user.Plant = this.userConfigMainFormGroup.get('plant').value;
              this.user.DocumentType = this.userConfigMainFormGroup.get('documentType').value;
              this.user.Priority = this.userConfigMainFormGroup.get('priority').value;
              // this.user.DisplayTitle = this.userConfigMainFormGroup.get('displayTitle').value;
              this.user.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.UpdateUserPlantDocumentType(this.user).subscribe(
                () => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User configuration updated successfully', SnackBarStatus.success);
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
            Catagory: 'User Config'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user = new UserPlantDocumentType();
              this.user.UserName = this.userConfigMainFormGroup.get('userName').value;
              this.user.Plant = this.userConfigMainFormGroup.get('plant').value;
              this.user.DocumentType = this.userConfigMainFormGroup.get('documentType').value;
              this.user.Priority = this.userConfigMainFormGroup.get('priority').value;
              // this.user.DisplayTitle = this.userConfigMainFormGroup.get('displayTitle').value;
              this.user.CreatedBy = this.authenticationDetails.userName.toString();
              // this.user.Profile = this.slectedProfile;
              this._masterService.CreateUserPlantDocumentType(this.user).subscribe(
                () => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User configuration created successfully', SnackBarStatus.success);
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
      Object.keys(this.userConfigMainFormGroup.controls).forEach(key => {
        this.userConfigMainFormGroup.get(key).markAsTouched();
        this.userConfigMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.userConfigMainFormGroup.valid) {
      if (this.user.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'User Config'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.user.UserName = this.userConfigMainFormGroup.get('userName').value;
              this.user.Plant = this.userConfigMainFormGroup.get('plant').value;
              this.user.DocumentType = this.userConfigMainFormGroup.get('documentType').value;
              this.user.Priority = this.userConfigMainFormGroup.get('priority').value;
              // this.user.DisplayTitle = this.userConfigMainFormGroup.get('displayTitle').value;
              this.user.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.DeleteUserPlantDocumentType(this.user).subscribe(
                () => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('User configuration deleted successfully', SnackBarStatus.success);
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
      Object.keys(this.userConfigMainFormGroup.controls).forEach(key => {
        this.userConfigMainFormGroup.get(key).markAsTouched();
        this.userConfigMainFormGroup.get(key).markAsDirty();
      });
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    this.user = this.currentSelectedUser;
    // console.log(this.user);
    if (this.user) {
      this.userConfigMainFormGroup.get('userName').patchValue(this.user.UserName);
      this.userConfigMainFormGroup.get('plant').patchValue(this.user.Plant);
      this.userConfigMainFormGroup.get('documentType').patchValue(this.user.DocumentType);
      this.userConfigMainFormGroup.get('priority').patchValue(this.user.Priority);
      // this.userConfigMainFormGroup.get('displayTitle').patchValue(this.user.DisplayTitle);
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





