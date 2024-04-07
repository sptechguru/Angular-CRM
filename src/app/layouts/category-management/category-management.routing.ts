import { Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const CategoryManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: CategoryListComponent,
             data: {depth:3}
        },
        {
            path: 'add-edit-category/:id',
            component: AddEditCategoryComponent,
             data: {depth:5}
        },
        {
            path: 'add-edit-category',
            component: AddEditCategoryComponent,
             data: {depth:4}
        }]
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
