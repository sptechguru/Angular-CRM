import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { AddEditClientComponent } from './add-edit-client/add-edit-client.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const ClientManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: ClientListComponent,
             data: {depth:3}
        },
        {
            path: 'add-edit-client/:id',
            component: AddEditClientComponent,
             data: {depth:4}
        },
        {
            path: 'add-edit-client',
            component: AddEditClientComponent,
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
