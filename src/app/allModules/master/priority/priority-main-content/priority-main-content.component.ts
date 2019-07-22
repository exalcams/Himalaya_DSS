import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { Priority, AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'priority-main-content',
  templateUrl: './priority-main-content.component.html',
  styleUrls: ['./priority-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PriorityMainContentComponent implements OnInit, OnChanges {
  @Input() currentSelectedPriority: Priority = new Priority();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  Priority: Priority;
  PriorityMainFormGroup: FormGroup;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];

  constructor(private _masterService: MasterService, private _formBuilder: FormBuilder, private _router: Router,
    public snackBar: MatSnackBar, private dialog: MatDialog) {
    this.PriorityMainFormGroup = this._formBuilder.group({
      PriorityID: ['', Validators.required],
      PriorityName: ['', Validators.required]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.Priority = new Priority();
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
    this.Priority = new Priority();
    this.PriorityMainFormGroup.reset();
    Object.keys(this.PriorityMainFormGroup.controls).forEach(key => {
      this.PriorityMainFormGroup.get(key).markAsUntouched();
    });

  }

  SaveClicked(): void {
    if (this.PriorityMainFormGroup.valid) {
      if (this.Priority.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'Priority'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.Priority.Priority_ID = this.PriorityMainFormGroup.get('PriorityID').value;
              this.Priority.Priority_Name = this.PriorityMainFormGroup.get('PriorityName').value;
              this.Priority.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.UpdatePriority(this.Priority).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Priority updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Priority updated successfully');
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
            Catagory: 'Priority'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.Priority = new Priority();
              this.Priority.Priority_ID = this.PriorityMainFormGroup.get('PriorityID').value;
              this.Priority.Priority_Name = this.PriorityMainFormGroup.get('PriorityName').value;
              this.Priority.CreatedBy = this.authenticationDetails.userName.toString();
              this._masterService.CreatePriority(this.Priority).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Priority created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Priority created successfully');
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
      Object.keys(this.PriorityMainFormGroup.controls).forEach(key => {
        this.PriorityMainFormGroup.get(key).markAsTouched();
        this.PriorityMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.PriorityMainFormGroup.valid) {
      if (this.Priority.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'Priority'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.Priority.Priority_ID = this.PriorityMainFormGroup.get('PriorityID').value;
              this.Priority.Priority_Name = this.PriorityMainFormGroup.get('PriorityName').value;
              this.Priority.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.DeletePriority(this.Priority).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Priority deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Priority deleted successfully');
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
      Object.keys(this.PriorityMainFormGroup.controls).forEach(key => {
        this.PriorityMainFormGroup.get(key).markAsTouched();
        this.PriorityMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    // this.Priority = this.currentSelectedPriority;
    if (this.currentSelectedPriority) {
      this.Priority = new Priority();
      this.Priority.ID = this.currentSelectedPriority.ID;
      this.Priority.Priority_ID = this.currentSelectedPriority.Priority_ID;
      this.Priority.Priority_Name = this.currentSelectedPriority.Priority_Name;
      this.Priority.IsActive = this.currentSelectedPriority.IsActive;
      this.Priority.CreatedBy = this.currentSelectedPriority.CreatedBy;
      this.Priority.CreatedOn = this.currentSelectedPriority.CreatedOn;
      this.Priority.ModifiedBy = this.currentSelectedPriority.ModifiedBy;
      this.Priority.ModifiedOn = this.currentSelectedPriority.ModifiedOn;
      this.PriorityMainFormGroup.get('PriorityID').patchValue(this.Priority.Priority_ID);
      this.PriorityMainFormGroup.get('PriorityName').patchValue(this.Priority.Priority_Name);

    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

} 
