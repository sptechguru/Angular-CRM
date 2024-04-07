import { Routes } from '@angular/router';
import { ProductAttributeListComponent } from './product-attribute-list/product-attribute-list.component';
import { AddEditProductAttributeComponent } from './add-edit-product-attribute/add-edit-product-attribute.component';
import { AddAttributeToProductComponent } from './add-attribute-to-product/add-attribute-to-product.component';
import { AttributeValueListComponent } from './attribute-value-list/attribute-value-list.component';

// import { OrderDetailsComponent } from './order-details/order-details.component';

export const ProductAttributeManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: ProductAttributeListComponent
        },
        {
            path: 'add-edit-product-attribute/:id',
            component: AddEditProductAttributeComponent,
              data: {depth:4}
        },
        {
            path: 'add-edit-product-attribute/:pid/:id',
            component: AddEditProductAttributeComponent,
              data: {depth:5}
        },
        {
            path: 'add-edit-product-attribute',
            component: AddEditProductAttributeComponent,
              data: {depth:4}
        },
        {
            path: 'add-attribute-to-product/:pid',
            component: AddAttributeToProductComponent,
              data: {depth:4}
        },
        {
            path: 'add-attribute-to-product',
            component: AddAttributeToProductComponent,
              data: {depth:4}
        },
        {
            path: 'add-attribute-to-product/:pid/:vid',
            component: AddAttributeToProductComponent,
              data: {depth:4}
        },
        {
            path: 'attribute-value-list/:pid',
            component: AttributeValueListComponent,
              data: {depth:5}
        },
        {
            path: 'attribute-value-list/:pid/:vid',
            component: AttributeValueListComponent,
              data: {depth:5}
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
