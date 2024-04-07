import { Routes } from '@angular/router';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { AddEditPartnerComponent } from './add-edit-partner/add-edit-partner.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const PartnerManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: PartnerListComponent,
             data: {depth:3}
        },
        {
            path: 'add-edit-partner/:id',
            component: AddEditPartnerComponent,
             data: {depth:4}
        },
        {
            path: 'add-edit-partner',
            component: AddEditPartnerComponent,
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
