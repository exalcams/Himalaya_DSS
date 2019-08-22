import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    // tslint:disable-next-line:max-line-length
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    MatToolbarModule, MatProgressSpinnerModule, MatSidenavModule
    // MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, 
    // MatSpinner, MatProgressSpinner, MatTooltipModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import { UserComponent } from './user/user.component';
import { UserSideBarComponent } from './user/user-side-bar/user-side-bar.component';
import { UserMainContentComponent } from './user/user-main-content/user-main-content.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { DocumentTypeMainContentComponent } from './document-type/document-type-main-content/document-type-main-content.component';
import { DocumentTypeSideBarComponent } from './document-type/document-type-side-bar/document-type-side-bar.component';
import { OutputTypeComponent } from './output-type/output-type.component';
import { OutputTypeMainContentComponent } from './output-type/output-type-main-content/output-type-main-content.component';
import { OutputTypeSideBarComponent } from './output-type/output-type-side-bar/output-type-side-bar.component';
import { UserPlantDocTypeComponent } from './user-plant-doctype/user-plant-doctype.component';
import { UserPlantDocTypeMainContentComponent } from './user-plant-doctype/user-plant-doctype-main-content/user-plant-doctype-main-content.component';
import { UserPlantDocTypeSideBarComponent } from './user-plant-doctype/user-plant-doctype-side-bar/user-plant-doctype-side-bar.component';
import { PriorityComponent } from './priority/priority.component';
import { PriorityMainContentComponent } from './priority/priority-main-content/priority-main-content.component';
import { PrioritySideBarComponent } from './priority/priority-side-bar/priority-side-bar.component';
import { PlantComponent } from './plant/plant.component';
import { PlantMainContentComponent } from './plant/plant-main-content/plant-main-content.component';
import { PlantSideBarComponent } from './plant/plant-side-bar/plant-side-bar.component';

const menuRoutes: Routes = [
    {
        path: 'user',
        component: UserComponent,
    },
    {
        path: 'priority',
        component: PriorityComponent,
    },
    {
        path: 'plant',
        component: PlantComponent,
    },
    {
        path: 'documentType',
        component: DocumentTypeComponent,
    },
    {
        path: 'outputType',
        component: OutputTypeComponent,
    }
];
@NgModule({
    declarations: [
        UserComponent,
        UserSideBarComponent,
        UserMainContentComponent,
        UserPlantDocTypeComponent,
        UserPlantDocTypeMainContentComponent,
        UserPlantDocTypeSideBarComponent,
        PriorityComponent,
        PriorityMainContentComponent,
        PrioritySideBarComponent,
        PlantComponent,
        PlantMainContentComponent,
        PlantSideBarComponent,
        DocumentTypeComponent,
        DocumentTypeMainContentComponent,
        DocumentTypeSideBarComponent,
        OutputTypeComponent,
        OutputTypeMainContentComponent,
        OutputTypeSideBarComponent,
    ],
    imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        FuseSharedModule,
        FileUploadModule,
        MatSidenavModule,
        // MatStepperModule,
        // MatListModule,
        // MatMenuModule,
        // MatRadioModule,
        // MatTooltipModule,
        RouterModule.forChild(menuRoutes)
    ],
    providers: [

    ]
})
export class MasterModule {
}

