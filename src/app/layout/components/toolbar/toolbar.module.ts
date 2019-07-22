import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, MatBadgeModule, MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { ChangePassDialogComponent } from './change-pass-dialog/change-pass-dialog.component';

@NgModule({
    declarations: [
        ToolbarComponent,
        ChangePassDialogComponent
    ],
    imports     : [
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatBadgeModule,
        MatMenuModule,
        MatToolbarModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports     : [
        ToolbarComponent
    ],
    entryComponents: [
        ChangePassDialogComponent
    ]
})
export class ToolbarModule
{
}
