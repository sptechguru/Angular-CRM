import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { deliveryManagementRoutesModule } from './delivery-management.routing';
import { DeliveryXlsuploadComponent } from './delivery-xlsupload/delivery-xlsupload.component';
import { UpdateDeliveryComponent } from './update-delivery/update-delivery.component';
import { MatRadioModule } from '@angular/material/radio';




@NgModule({
  declarations: [DeliveryListComponent, DeliveryXlsuploadComponent, UpdateDeliveryComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatRadioModule,
    RouterModule.forChild(deliveryManagementRoutesModule),
  ]
})
export class DeliveryManagementModule { }
