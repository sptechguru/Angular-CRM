import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipingManagementRoutingModule } from './shiping-management-routing.module';
import { ReadyStockComponent } from './ready-stock/ready-stock.component';
import { SharedModule } from 'app/shared/shared.module';
import { AddReadyStockComponent } from './ready-stock/add-ready-stock/add-ready-stock.component';
import { ViewReadyStockComponent } from './ready-stock/view-ready-stock/view-ready-stock.component';
import { RouterModule } from '@angular/router';

import { deliveryManagementRoutesModule } from './delivery-management/delivery-management.routing';



@NgModule({
  declarations: [
    ReadyStockComponent,
    AddReadyStockComponent,
    ViewReadyStockComponent,
    
  ],
  imports: [
    CommonModule,
   // ShipingManagementRoutingModule,
    SharedModule,
    RouterModule.forChild(ShipingManagementRoutingModule),
  ],
  entryComponents:[AddReadyStockComponent]
})
export class ShipingManagementModule { }
