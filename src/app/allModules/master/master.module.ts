import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    // tslint:disable-next-line:max-line-length
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,
    MatStepperModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule, MatSpinner, MatProgressSpinner, MatProgressSpinnerModule, MatTooltipModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule } from '@fuse/components';
import { FileUploadModule } from 'ng2-file-upload';
// import { MenuAppComponent } from './menu-app/menu-app.component';
// import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { UserSideBarComponent } from './user/user-side-bar/user-side-bar.component';
import { UserMainContentComponent } from './user/user-main-content/user-main-content.component';
// import { RoleSideBarComponent } from './role/role-side-bar/role-side-bar.component';
// import { RoleMainContentComponent } from './role/role-main-content/role-main-content.component';
// import { MenuAppSideBarComponent } from './menu-app/menu-app-side-bar/menu-app-side-bar.component';
// import { MenuAppMainContentComponent } from './menu-app/menu-app-main-content/menu-app-main-content.component';
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
    // {
    //     path: 'menuApp',
    //     component: MenuAppComponent,
    // },
    // {
    //     path: 'role',
    //     component: RoleComponent,
    // },
    {
        path: 'user',
        component: UserComponent,
    },
    // {
    //     path: 'configuration',
    //     component: UserPlantDocTypeComponent,
    // },
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
        // RoleComponent,
        // RoleSideBarComponent,
        // RoleMainContentComponent,
        // MenuAppComponent,
        // MenuAppSideBarComponent,
        // MenuAppMainContentComponent,
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
        MatStepperModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        FuseSharedModule,
        FileUploadModule,
        RouterModule.forChild(menuRoutes)
    ],
    providers: [

    ]
})
export class MasterModule {
}

