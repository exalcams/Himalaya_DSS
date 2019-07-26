import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationDialogComponent } from 'app/notifications/notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';
import { DocumentTypes, AuthenticationDetails, OutputType, DocumentOutputType } from 'app/models/master';

@Component({
  selector: 'document-type-main-content',
  templateUrl: './document-type-main-content.component.html',
  styleUrls: ['./document-type-main-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DocumentTypeMainContentComponent implements OnInit, OnChanges {
  @Input() currentSelectedDocumentType: DocumentOutputType = new DocumentOutputType();
  @Output() SaveSucceed: EventEmitter<string> = new EventEmitter<string>();
  @Output() ShowProgressBarEvent: EventEmitter<string> = new EventEmitter<string>();
  documentType: DocumentOutputType;
  documentTypeMainFormGroup: FormGroup;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  AllOutputTypes: OutputType[] = [];


  constructor(private _masterService: MasterService, private _formBuilder: FormBuilder, private _router: Router,
    public snackBar: MatSnackBar, private dialog: MatDialog) {
    this.documentTypeMainFormGroup = this._formBuilder.group({
      documentTypeID: ['', Validators.required],
      documentTypeName: ['', Validators.required],
      signatoryType: ['', Validators.required],
      outputTypeIDList: [[], Validators.required]
    });
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.documentType = new DocumentOutputType();
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
      this.GetAllOutputTypes();
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  ResetControl(): void {
    // this.menuAppMainFormGroup.get('appName').patchValue('');
    this.documentType = new DocumentOutputType();
    this.documentTypeMainFormGroup.reset();
    Object.keys(this.documentTypeMainFormGroup.controls).forEach(key => {
      this.documentTypeMainFormGroup.get(key).markAsUntouched();
    });

  }

  GetAllOutputTypes(): void {
    this._masterService.GetAllOutputTypes().subscribe(
      (data) => {
        this.AllOutputTypes = <OutputType[]>data;
        // console.log(data);
      },
      (err) => {
        console.error(err);
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }

  SaveClicked(): void {
    if (this.documentTypeMainFormGroup.valid) {
      if (this.documentType.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Update',
            Catagory: 'Document Type'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.documentType.Doc_Type_ID = this.documentTypeMainFormGroup.get('documentTypeID').value;
              this.documentType.Doc_Type_Name = this.documentTypeMainFormGroup.get('documentTypeName').value;
              this.documentType.SignatoryType = this.documentTypeMainFormGroup.get('signatoryType').value;
              // this.documentType.SignatoryType = 'Priority User';
              this.documentType.OutputType_ID_List = <string[]>this.documentTypeMainFormGroup.get('outputTypeIDList').value;
              this.documentType.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.UpdateDocumentType(this.documentType).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Document Type updated successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Document Type updated successfully');
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
            Catagory: 'Document Type'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.documentType = new DocumentOutputType();
              this.documentType.Doc_Type_ID = this.documentTypeMainFormGroup.get('documentTypeID').value;
              this.documentType.Doc_Type_Name = this.documentTypeMainFormGroup.get('documentTypeName').value;
              this.documentType.SignatoryType = this.documentTypeMainFormGroup.get('signatoryType').value;
              // this.documentType.SignatoryType = 'Priority User';
              this.documentType.OutputType_ID_List = <string[]>this.documentTypeMainFormGroup.get('outputTypeIDList').value;
              this.documentType.CreatedBy = this.authenticationDetails.userName.toString();
              this._masterService.CreateDocumentType(this.documentType).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Document Type created successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Document Type created successfully');
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
      Object.keys(this.documentTypeMainFormGroup.controls).forEach(key => {
        this.documentTypeMainFormGroup.get(key).markAsTouched();
        this.documentTypeMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  DeleteClicked(): void {
    if (this.documentTypeMainFormGroup.valid) {
      if (this.documentType.ID) {
        const dialogConfig: MatDialogConfig = {
          data: {
            Actiontype: 'Delete',
            Catagory: 'Document Type'
          },
          panelClass: 'confirmation-dialog'
        };
        const dialogRef = this.dialog.open(NotificationDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
          result => {
            if (result) {
              this.ShowProgressBarEvent.emit('show');
              this.documentType.Doc_Type_ID = this.documentTypeMainFormGroup.get('documentTypeID').value;
              this.documentType.Doc_Type_Name = this.documentTypeMainFormGroup.get('documentTypeName').value;
              this.documentType.SignatoryType = this.documentTypeMainFormGroup.get('signatoryType').value;
              // this.documentType.SignatoryType = 'Priority User';
              this.documentType.OutputType_ID_List = <string[]>this.documentTypeMainFormGroup.get('outputTypeIDList').value;
              this.documentType.ModifiedBy = this.authenticationDetails.userName.toString();
              this._masterService.DeleteDocumentType(this.documentType).subscribe(
                (data) => {
                  // console.log(data);
                  this.ResetControl();
                  this.notificationSnackBarComponent.openSnackBar('Document Type deleted successfully', SnackBarStatus.success);
                  this.SaveSucceed.emit('success');
                  this.ShowProgressBarEvent.emit('hide');
                  // this._masterService.TriggerNotification('Document Type deleted successfully');
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
      Object.keys(this.documentTypeMainFormGroup.controls).forEach(key => {
        this.documentTypeMainFormGroup.get(key).markAsTouched();
        this.documentTypeMainFormGroup.get(key).markAsDirty();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedDocumentType);
    // this.documentType = this.currentSelectedDocumentType;
    if (this.currentSelectedDocumentType) {
      this.documentType = new DocumentOutputType();
      this.documentType.ID = this.currentSelectedDocumentType.ID;
      this.documentType.Doc_Type_ID = this.currentSelectedDocumentType.Doc_Type_ID;
      this.documentType.Doc_Type_Name = this.currentSelectedDocumentType.Doc_Type_Name;
      this.documentType.SignatoryType = this.currentSelectedDocumentType.SignatoryType;
      this.documentType.OutputType_ID_List = this.currentSelectedDocumentType.OutputType_ID_List;
      this.documentType.IsActive = this.currentSelectedDocumentType.IsActive;
      this.documentType.CreatedBy = this.currentSelectedDocumentType.CreatedBy;
      this.documentType.CreatedOn = this.currentSelectedDocumentType.CreatedOn;
      this.documentType.ModifiedBy = this.currentSelectedDocumentType.ModifiedBy;
      this.documentType.ModifiedOn = this.currentSelectedDocumentType.ModifiedOn;
      this.documentTypeMainFormGroup.get('documentTypeID').patchValue(this.documentType.Doc_Type_ID);
      this.documentTypeMainFormGroup.get('documentTypeName').patchValue(this.documentType.Doc_Type_Name);
      this.documentTypeMainFormGroup.get('signatoryType').patchValue(this.documentType.SignatoryType);
      this.documentTypeMainFormGroup.get('outputTypeIDList').patchValue(this.documentType.OutputType_ID_List);

    } else {
      // this.menuAppMainFormGroup.get('appName').patchValue('');
      this.ResetControl();
    }
  }

} 
