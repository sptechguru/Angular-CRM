import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderPackagingListComponent } from './order-packaging-list/order-packaging-list.component';
import { AddBrandingAmountComponent } from './add-branding-amount/add-branding-amount.component';
import { MakeManualPaymentComponent } from './make-manual-payment/make-manual-payment.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { AddBillToOrderComponent } from './add-bill-to-order/add-bill-to-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';

export const OrderManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: OrderListComponent,
             data: {depth:3}
        },{
            path: 'order-details/:id',
            component: OrderDetailsComponent,
             data: {depth:4}
        },{
            path: 'order-packaging-list/:id/:sid',
             data: {depth:4},
            component: OrderPackagingListComponent
        },{
            path: 'add-branding-amount/:id/:vid/:quantity',
            component: AddBrandingAmountComponent,
             data: {depth:5}
        },{
            path: 'make-manual-payment/:id',
            component: MakeManualPaymentComponent,
             data: {depth:5}
        },{
            path: 'payment-list/:id',
            component: PaymentListComponent,
             data: {depth:5}
        },{
            path: 'add-bill-to-order/:id',
            component: AddBillToOrderComponent,
             data: {depth:5}
        },{
            path: 'add-bill-to-order/:id/:sid',
            component: AddBillToOrderComponent,
             data: {depth:5}
        },{
            path: 'bill-list/:id',
            component: BillListComponent,
             data: {depth:5}
        },
        {
            path: 'create-order',
            component: CreateOrderComponent,
             data: {depth:5}
        }
    
    ]
    },
];
