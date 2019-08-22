import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatRadioModule,
    // MatMenuModule,
    // MatNativeDateModule,
    // MatTabsModule,
    // MatTooltipModule,
    // MatButtonToggleModule,
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    // MatTreeModule,
    // MatStepperModule,
    // MatSidenavModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatProgressBarModule,
    // MatRippleModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatExpansionModule,
    // MatGridListModule,    
    // MatListModule,
} from '@angular/material';

// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import {
//     FuseCountdownModule,
//     FuseHighlightModule,
//     FuseMaterialColorPickerModule,
//     FuseWidgetModule
// } from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { DashboardService } from '../../services/dashboard.service';
import { DialogComponent } from './dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { PdfDialogComponent } from './pdf-dialog/pdf-dialog.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

const routes = [
    {
        path: 'adminDashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatRadioModule,
        // MatTabsModule,
        // MatTooltipModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatTreeModule,
        // MatAutocompleteModule,
        // MatBadgeModule,
        // MatBottomSheetModule,
        // MatSidenavModule,
        // MatSliderModule,
        // MatSlideToggleModule,
        // MatRippleModule,
        // MatProgressBarModule,
        // MatListModule,
        // MatExpansionModule,
        // MatGridListModule,
        // MatCheckboxModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatButtonToggleModule,

        // NgxChartsModule,

        // FuseCountdownModule,
        // FuseHighlightModule,
        // FuseMaterialColorPickerModule,
        // FuseWidgetModule,
        FuseSharedModule,
        FormsModule,
        PdfViewerModule
    ],
    declarations: [DashboardComponent, DialogComponent, PdfDialogComponent, AdminDashboardComponent],
    providers: [DashboardService],
    entryComponents: [
        DialogComponent,
        PdfDialogComponent,
    ]
})
export class PagesModule { }
