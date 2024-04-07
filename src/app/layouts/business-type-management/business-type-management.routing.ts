import { Routes } from '@angular/router';
import { BusinessTypeListComponent } from './business-type-list/business-type-list.component';
import { AddEditBusinessTypeComponent } from './add-edit-business-type/add-edit-business-type.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const BusinessTypeManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: BusinessTypeListComponent,
              data: {depth:3}
        },
        {
            path: 'add-edit-business-type/:id',
            component: AddEditBusinessTypeComponent,
              data: {depth:4}
        },
        {
            path: 'add-edit-business-type',
            component: AddEditBusinessTypeComponent,
              data: {depth:4}
        }
    ]
    }
    // {
    //     path: '',
    //     children: [{
    //         path: 'add-user',
    //         component: AddEditUserComponent
    //     }]
    // },
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    // { path: '', component: DashboardComponent },
    // { path: 'user-profile', component: UserProfileComponent }
];
