import { Routes } from '@angular/router';
import { CrmUserGuardService, PermissionGuardService } from 'app/shared/services/auth.guard.service';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';

export const AdminLayoutRoutes: Routes = [
    { path: '', redirectTo: 'dashboard' },
    { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule', data: { depth: 2, role: 'dashboard' } },
    // src\app\layouts\dashboard\dashboard.module.ts
    { path: 'create-user', loadChildren: '../new-cutomer-mangement/new-customer-mangement.module#NewCustomerMangementModule', data: { depth: 2, role: 'dashboard' } },

    { path: 'kyc-list', loadChildren: '../kyc-management/kyc-management.module#KycManagementModule', data: { depth: 2, role: 'kyc-list' }, },
    // { path: 'contact-list', loadChildren: '../contact-management/contact-management.module#ContactManagementModule' , data:{depth: 2, role : 'reseller-management'} , canActivate:[PermissionGuardService] },
    { path: 'users-management', loadChildren: '../users-management/users-management.module#UsersManagementModule', data: { depth: 2, role: "reseller-management" }, canActivate: [PermissionGuardService] },
    { path: 'blog-management', loadChildren: '../blog-management/blog-management.module#BlogManagementModule', data: { depth: 2, role: "reseller-management" }, canActivate: [PermissionGuardService] },
    { path: 'order-management', loadChildren: '../order-management/order-management.module#OrderManagementModule', data: { depth: 2, role: 'order-management' }, canActivate: [PermissionGuardService] },
    { path: 'user-profile', loadChildren: '../user-profile/user-profile.module#UserProfileModule' },
    { path: 'cms', loadChildren: '../cms/cms.module#CmsModule', data: { depth: 2 } },
    { path: 'requset-call-back', loadChildren: '../requset-call-back/requset-call-back.module#RequsetCallBackModule', data: { depth: 2 } },
    { path: 'category-management', loadChildren: '../category-management/category-management.module#CategoryManagementModule', data: { depth: 2, role: 'category-management' }, canActivate: [PermissionGuardService] },
    { path: 'client-management', loadChildren: '../client-management/client-management.module#ClientManagementModule', data: { depth: 2, role: 'business-sectors' }, canActivate: [PermissionGuardService] },
    { path: 'partner-management', loadChildren: '../partner-management/partner-management.module#PartnerManagementModule', data: { depth: 2, role: 'business-category' }, canActivate: [PermissionGuardService] },
    { path: 'business-type-management', loadChildren: '../business-type-management/business-type-management.module#BusinessTypeManagementModule', data: { depth: 2, role: 'business-type' }, canActivate: [PermissionGuardService] },
    { path: 'inventory-management', loadChildren: '../inventory-management/inventory-management.module#InventoryManagementModule', data: { depth: 2, role: 'inventory-management' }, canActivate: [PermissionGuardService] },
    { path: 'facility-management', loadChildren: '../facility-management/facility-management.module#FacilityManagementModule', data: { depth: 2, role: 'facility-management' }, canActivate: [PermissionGuardService] },
    { path: 'gst-tax-type-management', loadChildren: '../gst-tax-type-management/gst-tax-type-management.module#GstTaxTypeManagementModule', data: { depth: 2, role: 'gst-tax-type' }, canActivate: [PermissionGuardService] },
    { path: 'contact-queries', loadChildren: '../contact-queries/contact-queries.module#ContactQueriesModule', data: { depth: 2, role: 'contact-query' }, canActivate: [PermissionGuardService] },
    { path: 'customer-management', loadChildren: '../custumer-manegment/custumer-manegment.module#CustumerManegmentModule', data: { depth: 2, role: 'contact-query' }, canActivate: [PermissionGuardService] },
    { path: 'crm-user', loadChildren: '../crm-user/crm-user.module#CrmUserModule', data: { depth: 2, role: 'crm-user' }, canActivate: [CrmUserGuardService, PermissionGuardService] },
    { path: 'menu-management', loadChildren: '../menu-manegment/menu-manegment.module#MenuManegmentModule', data: { depth: 2, role: 'menu-manegment' }, canActivate: [PermissionGuardService] },
    { path: 'catelog-management', loadChildren: '../catelog-manegment/catelog-manegment.module#CatelogManegmentModule', data: { depth: 2, role: 'catelog-manegment' }, canActivate: [PermissionGuardService] },
    { path: 'shiping-management',loadChildren:()=>import('../shiping-management/shiping-management.module').then(m=>m.ShipingManagementModule),data: { depth: 2, role: 'shiping-manegment' }, canActivate: [PermissionGuardService]}
    
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
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'user-profile', component: UserProfileComponent }
];
