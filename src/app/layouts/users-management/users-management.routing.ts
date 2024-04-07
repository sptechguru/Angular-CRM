import { Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';

export const UsersManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: UsersListComponent
        }],
         data: {depth:3}
    },
    {
        path: '',
        children: [{
            path: 'add-user',
            component: AddEditUserComponent
        }],
          data: {depth:4}
    },
    {
        path: '',
        children: [{
            path: 'edit-user/:id',
            component: AddEditUserComponent
        }],
          data: {depth:4}
    },
    {
        path: '',
        children: [{
            path: 'view-user/:userType/:id',
            component: ViewUserComponent
        }],
          data: {depth:4}
    },

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
