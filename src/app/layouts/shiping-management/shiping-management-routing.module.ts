// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { AddReadyStockComponent } from './ready-stock/add-ready-stock/add-ready-stock.component';
// import { ReadyStockComponent } from './ready-stock/ready-stock.component';
// import { ViewReadyStockComponent } from './ready-stock/view-ready-stock/view-ready-stock.component';


// const routes: Routes = [
//   {
//     path:'ready-stock',
//     component:ReadyStockComponent
//   },
//   {
//     path:'ready-stock/view/:id',
//     component:ViewReadyStockComponent,
//   },
//   {
//     path:'delivery-management',
//     loadChildren:'./delivery-management/delivery-management.module#DeliveryManagementModule',
//      },
  

 
  
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
//export class ShipingManagementRoutingModule { }

import { Routes } from '@angular/router';
import { ReadyStockComponent } from './ready-stock/ready-stock.component';
import { ViewReadyStockComponent } from './ready-stock/view-ready-stock/view-ready-stock.component';




export const ShipingManagementRoutingModule: Routes = [
    {
        path: 'ready-stock',
        children: [{
            path: '',
            component: ReadyStockComponent
        }
    ]
},
{
  path:'ready-stock/view/:id',
  component:ViewReadyStockComponent,
},
{
  path:'delivery-management',
  loadChildren:'./delivery-management/delivery-management.module#DeliveryManagementModule',
   },
// {
//     path:'update-Sku/:productid',
//     component: NewSkuComponent
// },
// {
//     path:'xls',
//     component:SkuXlsuploadComponent
// }
]

