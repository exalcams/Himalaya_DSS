import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { Plant, AuthenticationDetails } from 'app/models/master';

@Component({
  selector: 'plant-main-content',
  templateUrl: './plant-main-content.component.html',
  styleUrls: ['./plant-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PlantMainContentComponent implements OnInit, OnChanges {
  @Input() currentSelectedPlant: Plant = new Plant();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  Plant: Plant;
  PlantMainFormGroup: FormGroup;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];

  constructor(private _masterService: MasterService, private _formBuilder: FormBuilder, private _router: Router,
    public snackBar: MatSnackBar, private dialog: MatDialog) {
    this.PlantMainFormGroup = this._formBuilder.group({
      PlantID: ['', Validators.required],
      PlantName: ['', Validators.required]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.Plant = new Plant();
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
    this.Plant = new Plant();
    this.PlantMainFormGroup.reset();
    Object.keys(this.PlantMainFormGroup.controls).forEach(key => {
      this.PlantMainFormGroup.get(key).markAsUntouched();
    });

  }

  SaveClicked(): void {
    if (this.PlantMainFormGroup.valid) {
      if (this.Plant.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'Plant'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.Plant.Plant_ID = this.PlantMainFormGroup.get('PlantID').value;
              this.Plant.Plant_Name = this.PlantMainFormGroup.get('PlantName').value;
              this.Plant.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.UpdatePlant(this.Plant).subscribe(
                () => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Plant updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Plant updated successfully');
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
            Catagory: 'Plant'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.Plant = new Plant();
              this.Plant.Plant_ID = this.PlantMainFormGroup.get('PlantID').value;
              this.Plant.Plant_Name = this.PlantMainFormGroup.get('PlantName').value;
              this.Plant.CreatedBy = this.authenticationDetails.userName.toString();
              this._masterService.CreatePlant(this.Plant).subscribe(
                () => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Plant created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Plant created successfully');
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
      Object.keys(this.PlantMainFormGroup.controls).forEach(key => {
        this.PlantMainFormGroup.get(key).markAsTouched();
        this.PlantMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.PlantMainFormGroup.valid) {
      if (this.Plant.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'Plant'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.Plant.Plant_ID = this.PlantMainFormGroup.get('PlantID').value;
              this.Plant.Plant_Name = this.PlantMainFormGroup.get('PlantName').value;
              this.Plant.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.DeletePlant(this.Plant).subscribe(
                () => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Plant deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Plant deleted successfully');
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
      Object.keys(this.PlantMainFormGroup.controls).forEach(key => {
        this.PlantMainFormGroup.get(key).markAsTouched();
        this.PlantMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    // this.Plant = this.currentSelectedPlant;
    if (this.currentSelectedPlant) {
      this.Plant = new Plant();
      this.Plant.ID = this.currentSelectedPlant.ID;
      this.Plant.Plant_ID = this.currentSelectedPlant.Plant_ID;
      this.Plant.Plant_Name = this.currentSelectedPlant.Plant_Name;
      this.Plant.IsActive = this.currentSelectedPlant.IsActive;
      this.Plant.CreatedBy = this.currentSelectedPlant.CreatedBy;
      this.Plant.CreatedOn = this.currentSelectedPlant.CreatedOn;
      this.Plant.ModifiedBy = this.currentSelectedPlant.ModifiedBy;
      this.Plant.ModifiedOn = this.currentSelectedPlant.ModifiedOn;
      this.PlantMainFormGroup.get('PlantID').patchValue(this.Plant.Plant_ID);
      this.PlantMainFormGroup.get('PlantName').patchValue(this.Plant.Plant_Name);

    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

} 
