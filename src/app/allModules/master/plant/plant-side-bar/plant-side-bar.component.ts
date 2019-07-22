import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { Plant } from 'app/models/master';

@Component({
  selector: 'plant-side-bar',
  templateUrl: './plant-side-bar.component.html',
  styleUrls: ['./plant-side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PlantSideBarComponent implements OnInit, OnChanges {

  searchText: string;
  selectID: number;
  @Input() AllPlants: Plant[] = [];
  @Output() PlantSelectionChanged: EventEmitter<Plant> = new EventEmitter<Plant>();
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
    if (this.AllPlants.length > 0) {
      this.selectID = this.AllPlants[0].ID;
      this.loadSelectedPlant(this.AllPlants[0]);
    }
  }

  loadSelectedPlant(SelectedPlant: Plant): void {
    this.selectID = SelectedPlant.ID;
    this.PlantSelectionChanged.emit(SelectedPlant);
    // console.log(SelectedMenuApp);
  }

  clearPlant(): void {
    this.selectID = 0;
    this.PlantSelectionChanged.emit(null);
  }

}
