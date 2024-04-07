import { Routes } from '@angular/router';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { DeliveryXlsuploadComponent } from './delivery-xlsupload/delivery-xlsupload.component';
import { UpdateDeliveryComponent } from './update-delivery/update-delivery.component';



export const deliveryManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: DeliveryListComponent
        }
    ]
},
{
    path:'update-delivery/:productid',
    component: UpdateDeliveryComponent
},
{
    path:'xls',
    component:DeliveryXlsuploadComponent
}
]
