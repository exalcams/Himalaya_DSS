import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,

    // MatTabsModule,
    // MatTooltipModule,
    // MatTreeModule,
    // MatAutocompleteModule,
    // MatBadgeModule,
    // MatBottomSheetModule,
    // MatButtonToggleModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatExpansionModule,
    // MatGridListModule,
    // MatIconModule,
    // MatListModule,
    // MatMenuModule,
    // MatNativeDateModule,
    // MatProgressBarModule,
    // MatRadioModule,
    // MatRippleModule,
    // MatSidenavModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatStepperModule,


} from '@angular/material';

// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import {
//     FuseCountdownModule,
//     FuseHighlightModule,
//     FuseMaterialColorPickerModule,
//     FuseWidgetModule
// } from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { ReportService } from 'app/services/report.service';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { UserAuditComponent } from './user-audit/user-audit.component';

const routes = [
    {
        path: 'loginHistory',
        component: LoginHistoryComponent
    },
    {
        path: 'userAudit',
        component: UserAuditComponent
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
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,

        // MatTabsModule,
        // MatTooltipModule,
        // MatTreeModule,
        // MatAutocompleteModule,
        // MatBadgeModule,
        // MatBottomSheetModule,
        // MatButtonToggleModule,
        // MatCheckboxModule,
        // MatChipsModule,
        // MatStepperModule,
        // MatExpansionModule,
        // MatGridListModule,
        // MatIconModule,
        // MatListModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatProgressBarModule,
        // MatRadioModule,
        // MatRippleModule,
        // MatSidenavModule,
        // MatSliderModule,
        // MatSlideToggleModule,

        // NgxChartsModule,

        // FuseCountdownModule,
        // FuseHighlightModule,
        // FuseMaterialColorPickerModule,
        // FuseWidgetModule,

        FuseSharedModule,
        FormsModule,
    ],
    declarations: [LoginHistoryComponent, UserAuditComponent],
    providers: [ReportService],
    entryComponents: [
    ]
})
export class ReportsModule { }
