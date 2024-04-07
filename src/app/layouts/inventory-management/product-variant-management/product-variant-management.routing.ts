import { Routes } from '@angular/router';
import { ProductVariantListComponent } from './product-variant-list/product-variant-list.component';
import { AddEditProductVariantComponent } from './add-edit-product-variant/add-edit-product-variant.component';
import { ProductVariantDetailsComponent } from './product-variant-details/product-variant-details.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const ProductVariantManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: 'variant-list/:id',
            component: ProductVariantListComponent,
              data: {depth:5}
        },
        {
            path: 'add-edit-product-variant/:id/:vid',
            component: AddEditProductVariantComponent,
              data: {depth:5}
        },
        {
            path: 'add-edit-product-variant/:id',
            component: AddEditProductVariantComponent,
              data: {depth:5}
        },
        {
            path: 'product-variant-details/:id/:vid',
            component: ProductVariantDetailsComponent,
              data: {depth:4}
        },
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
