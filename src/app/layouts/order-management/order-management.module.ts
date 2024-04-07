import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderManagementRoutesModule } from './order-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderPackagingListComponent } from './order-packaging-list/order-packaging-list.component';
import { AddBrandingAmountComponent } from './add-branding-amount/add-branding-amount.component';
import { MakeManualPaymentComponent } from './make-manual-payment/make-manual-payment.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddBillToOrderComponent } from './add-bill-to-order/add-bill-to-order.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import {MatListModule} from '@angular/material/list';
import { CancelOrderModelComponent } from './cancel-order-model/cancel-order-model.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OrderManagementRoutesModule),
    SharedModule,
    FormsModule,
    MatListModule,
    ReactiveFormsModule,
    NgxExtendedPdfViewerModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule
  ],
  declarations: [
    OrderListComponent,
    OrderDetailsComponent,
    OrderPackagingListComponent,
    AddBrandingAmountComponent,
    MakeManualPaymentComponent,
    PaymentListComponent,
    
    AddBillToOrderComponent,
    BillListComponent,
    CancelOrderModelComponent,
    CreateOrderComponent
  ],
  entryComponents:[CancelOrderModelComponent]
})

export class OrderManagementModule { }
