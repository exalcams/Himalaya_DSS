import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MasterService } from 'app/services/master.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DocumentTypes, AuthenticationDetails, DocumentOutputType } from 'app/models/master';

@Component({
  selector: 'document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DocumentTypeComponent implements OnInit {
  AllDocumentTypes: DocumentOutputType[] = [];
  SelectedDocumentType: DocumentOutputType;
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
      if (this.MenuItems.indexOf('DocumentTypeMaster') < 0) {
        this.notificationSnackBarComponent.openSnackBar('You do not have permission to visit this page', SnackBarStatus.danger);
        this._router.navigate(['/auth/login']);
      }

      this.GetAllDocumentTypes();
    } else {
      this._router.navigate(['/auth/login']);
    }

  }
  GetAllDocumentTypes(): void {
    this.IsProgressBarVisibile = true;
    this._masterService.GetAllDocumentTypes().subscribe(
      (data) => {
        this.AllDocumentTypes = <DocumentOutputType[]>data;
        this.IsProgressBarVisibile = false;
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.error(err);
        this.IsProgressBarVisibile = false;
        this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
      }
    );
  }
  OnDocumentTypeSelectionChanged(selectedDocumentType: DocumentOutputType): void {
    // console.log(selectedMenuApp);
    this.SelectedDocumentType = selectedDocumentType;
  }
  OnShowProgressBarEvent(status: string): void {
    if (status === 'show') {
      this.IsProgressBarVisibile = true;
    } else {
      this.IsProgressBarVisibile = false;
    }

  }

  RefreshAllDocumentTypes(msg: string): void {
    // console.log(msg);
    this.GetAllDocumentTypes();
  }


}
