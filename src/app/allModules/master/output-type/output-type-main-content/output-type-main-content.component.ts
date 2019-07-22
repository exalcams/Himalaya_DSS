import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { OutputType, AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'output-type-main-content',
  templateUrl: './output-type-main-content.component.html',
  styleUrls: ['./output-type-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OutputTypeMainContentComponent implements OnInit, OnChanges {
  @Input() currentSelectedOutputType: OutputType = new OutputType();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  OutputType: OutputType;
  OutputTypeMainFormGroup: FormGroup;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];

  constructor(private _masterService: MasterService, private _formBuilder: FormBuilder, private _router: Router,
    public snackBar: MatSnackBar, private dialog: MatDialog) {
    this.OutputTypeMainFormGroup = this._formBuilder.group({
      OutputTypeID: ['', Validators.required],
      OutputTypeName: ['', Validators.required]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.OutputType = new OutputType();
    this.authenticationDetails = new AuthenticationDetails();
    // this.currentSelectedMenuApp = new MenuApp();
    // this.currentSelectedMenuApp.AppID = 0;
    // if(this.currentSelectedMenuApp)
    // console.log(this.currentSelectedMenuApp);
  }

  ngOnInit(): void {
    // console.log(this.currentSelectedMenuApp);
    // Retrive authorizationData
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  ResetControl(): void {
    // this.menuAppMainFormGroup.get('appName').patchValue('');
    this.OutputType = new OutputType();
    this.OutputTypeMainFormGroup.reset();
    Object.keys(this.OutputTypeMainFormGroup.controls).forEach(key => {
      this.OutputTypeMainFormGroup.get(key).markAsUntouched();
    });

  }

  SaveClicked(): void {
    if (this.OutputTypeMainFormGroup.valid) {
      if (this.OutputType.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'Output Type'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.OutputType.OutputType_ID = this.OutputTypeMainFormGroup.get('OutputTypeID').value;
              this.OutputType.OutputType_Name = this.OutputTypeMainFormGroup.get('OutputTypeName').value; 
              this.OutputType.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.UpdateOutputType(this.OutputType).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Output Type updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Output Type updated successfully');
                },
                (err) => {
                  console.error(err);
                  this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
                  this.ShowProgressBarEvent.emit('hide');
                }
              );
            }
          });

      } else {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Create',
            Catagory: 'Output Type'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.OutputType = new OutputType();
              this.OutputType.OutputType_ID = this.OutputTypeMainFormGroup.get('OutputTypeID').value;
              this.OutputType.OutputType_Name = this.OutputTypeMainFormGroup.get('OutputTypeName').value;
              this.OutputType.CreatedBy = this.authenticationDetails.userName.toString();
              this._masterService.CreateOutputType(this.OutputType).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Output Type created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Output Type created successfully');
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
      Object.keys(this.OutputTypeMainFormGroup.controls).forEach(key => {
        this.OutputTypeMainFormGroup.get(key).markAsTouched();
        this.OutputTypeMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.OutputTypeMainFormGroup.valid) {
      if (this.OutputType.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'Output Type'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.OutputType.OutputType_ID = this.OutputTypeMainFormGroup.get('OutputTypeID').value;
              this.OutputType.OutputType_Name = this.OutputTypeMainFormGroup.get('OutputTypeName').value;
              this.OutputType.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.DeleteOutputType(this.OutputType).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Output Type deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Output Type deleted successfully');
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
      Object.keys(this.OutputTypeMainFormGroup.controls).forEach(key => {
        this.OutputTypeMainFormGroup.get(key).markAsTouched();
        this.OutputTypeMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    // this.OutputType = this.currentSelectedOutputType;
    if (this.currentSelectedOutputType) {
      this.OutputType = new OutputType();
      this.OutputType.ID = this.currentSelectedOutputType.ID;
      this.OutputType.OutputType_ID = this.currentSelectedOutputType.OutputType_ID;
      this.OutputType.OutputType_Name = this.currentSelectedOutputType.OutputType_Name;
      this.OutputType.IsActive = this.currentSelectedOutputType.IsActive;
      this.OutputType.CreatedBy = this.currentSelectedOutputType.CreatedBy;
      this.OutputType.CreatedOn = this.currentSelectedOutputType.CreatedOn;
      this.OutputType.ModifiedBy = this.currentSelectedOutputType.ModifiedBy;
      this.OutputType.ModifiedOn = this.currentSelectedOutputType.ModifiedOn;
      this.OutputTypeMainFormGroup.get('OutputTypeName').patchValue(this.OutputType.OutputType_Name);
      this.OutputTypeMainFormGroup.get('OutputTypeID').patchValue(this.OutputType.OutputType_ID);
    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

} 
