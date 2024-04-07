import { Routes } from '@angular/router';
import { NewSkuComponent } from './new-sku/new-sku.component';
import { SkListComponent} from'./sk-list/sk-list.component'
import { SkuXlsuploadComponent } from './sku-xlsupload/sku-xlsupload.component';


export const skuManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: SkListComponent
        }
    ]
},
{
    path:'update/:productid',
    component: NewSkuComponent
},
{
    path:'xls',
    component:SkuXlsuploadComponent
}
]
