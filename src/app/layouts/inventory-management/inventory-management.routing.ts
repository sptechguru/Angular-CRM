import { Routes } from '@angular/router';
// import { OrderDetailsComponent } from './order-details/order-details.component';

export const InventoryManagementRoutesModule: Routes = [
    { path: 'product-management', 
    loadChildren: './product-management/product-management.module#ProductManagementModule' , data: {depth:3} },
    { path: 'product-attribute-management', loadChildren: './product-attribute-management/product-attribute-management.module#ProductAttributeManagementModule' , data: {depth:3}},
    { path: 'product-variant-management', loadChildren: './product-variant-management/product-variant-management.module#ProductVariantManagementModule',data: {depth:3} },
    { path: 'product-variant-image-management', 
    loadChildren: './product-variant-image-management/product-variant-image-management.module#ProductVariantImageManagementModule', 
    data: {depth:3} },
    {
        path:'sku-management',
        loadChildren:'./sku-management/sku-management.module#SkuManagementModule',
     },
     {
         path:'trade-assurance',
         loadChildren:'./trade-assurance/trade-assurance.module#TradeAssuranceModule'
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
