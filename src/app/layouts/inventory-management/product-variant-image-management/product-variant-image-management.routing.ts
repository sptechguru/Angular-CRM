import { Routes } from '@angular/router';
import { ProductVariantImageListComponent } from './product-variant-image-list/product-variant-image-list.component';
import { AddEditProductVariantImageComponent } from './add-edit-product-variant-image/add-edit-product-variant-image.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const ProductVariantImageManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: 'variant-image-list/:vid/:Iid',
            component: ProductVariantImageListComponent,
              data: {depth:4}
        },
        {
            path: 'add-edit-product-variant-image/:vid/:Iid',
            component: AddEditProductVariantImageComponent,
              data: {depth:4}
        },
        {
            path: 'add-edit-product-variant-image/:vid/:Iid/:id',
            component: AddEditProductVariantImageComponent,
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
