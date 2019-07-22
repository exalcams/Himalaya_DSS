import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { Priority } from 'app/models/master';

@Component({
  selector: 'priority-side-bar',
  templateUrl: './priority-side-bar.component.html',
  styleUrls: ['./priority-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrioritySideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllPriorities: Priority[] = [];
  @Output() PrioritySelectionChanged: EventEmitter<Priority> = new EventEmitter<Priority>();
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
    if (this.AllPriorities.length > 0) {
      this.selectID = this.AllPriorities[0].ID;
      this.loadSelectedPriority(this.AllPriorities[0]);
    }
  }

  loadSelectedPriority(SelectedPriority: Priority): void {
    this.selectID = SelectedPriority.ID;
    this.PrioritySelectionChanged.emit(SelectedPriority);
    // console.log(SelectedMenuApp);
  }

  clearPriority(): void {
    this.selectID = 0;
    this.PrioritySelectionChanged.emit(null);
  }

}
