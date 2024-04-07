import { Routes } from '@angular/router';
import { KycListComponent } from './kyc-list/kyc-list.component';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';

export const KycManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: KycListComponent
        }],
         data: {depth:3}
    },
    {
        path: '',
        children: [{
            path: 'kyc-details/:id',
            component: KycDetailsComponent
        }],
         data: {depth:4}
       
    },
    {
        path: '',
        children: [{
            path: 'kyc-details',
            component: KycDetailsComponent
        }],
         data: {depth:4}
       
    }
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
