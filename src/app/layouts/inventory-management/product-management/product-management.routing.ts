import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { CreateProductXlsComponent } from './xls/create-product-xls/create-product-xls.component';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const ProductManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: ProductListComponent
        },
        {
            path: 'add-edit-product/:id',
            component: AddEditProductComponent,
             data: {depth:4}
        },
        {
            path: 'add-edit-product',
            component: AddEditProductComponent,
              data: {depth:4}
        },
        {
            path: 'product-details/:id',
            component: ProductDetailsComponent,
              data: {depth:4}
        },
        {
            path:'new-product',
            component:AddNewProductComponent
        },
        {
                path:'edit-product/:id',
                component:AddNewProductComponent
         },
         {
             path:'xls',
             component:CreateProductXlsComponent
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
