import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { OutputType } from 'app/models/master';

@Component({
  selector: 'output-type-side-bar',
  templateUrl: './output-type-side-bar.component.html',
  styleUrls: ['./output-type-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OutputTypeSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllOutputTypes: OutputType[] = [];
  @Output() OutputTypeSelectionChanged: EventEmitter<OutputType> = new EventEmitter<OutputType>();
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
    if (this.AllOutputTypes.length > 0) {
      this.selectID = this.AllOutputTypes[0].ID;
      this.loadSelectedOutputType(this.AllOutputTypes[0]);
    }
  }

  loadSelectedOutputType(SelectedOutputType: OutputType): void {
    this.selectID = SelectedOutputType.ID;
    this.OutputTypeSelectionChanged.emit(SelectedOutputType);
    // console.log(SelectedMenuApp);
  }

  clearOutputType(): void {
    this.selectID = 0;
    this.OutputTypeSelectionChanged.emit(null);
  }

}
