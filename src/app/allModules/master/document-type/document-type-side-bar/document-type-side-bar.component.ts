import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { DocumentOutputType } from 'app/models/master';

@Component({
  selector: 'document-type-side-bar',
  templateUrl: './document-type-side-bar.component.html',
  styleUrls: ['./document-type-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DocumentTypeSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllDocumentTypes: DocumentOutputType[] = [];
  @Output() DocumentTypeSelectionChanged: EventEmitter<DocumentOutputType> = new EventEmitter<DocumentOutputType>();
  notificationSnackBarComponent: NotificationSnackBarComponent;

  constructor(public snackBar: MatSnackBar) {
    this.searchText = '';
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    // if (this.AllMenuApps.length > 0) {
    //   this.selectID = this.AllMenuApps[0].AppID;
    // }
  }


  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.currentSelectedMenuApp);
    if (this.AllDocumentTypes.length > 0) {
      this.selectID = this.AllDocumentTypes[0].ID;
      this.loadSelectedDocumentType(this.AllDocumentTypes[0]);
    }
  }

  loadSelectedDocumentType(SelectedDocumentType: DocumentOutputType): void {
    this.selectID = SelectedDocumentType.ID;
    this.DocumentTypeSelectionChanged.emit(SelectedDocumentType);
    // console.log(SelectedMenuApp);
  }

  clearDocumentType(): void {
    this.selectID = 0;
    this.DocumentTypeSelectionChanged.emit(null);
  }

}
