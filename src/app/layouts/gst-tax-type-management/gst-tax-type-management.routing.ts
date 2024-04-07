import { Routes } from '@angular/router';
import { AddEditGstTaxTypeComponent } from './add-edit-gst-tax-type/add-edit-gst-tax-type.component';
import { GstTaxTypeListComponent } from './gst-tax-type-list/gst-tax-type-list.component';

export const GstTaxTypeManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: GstTaxTypeListComponent,
              data: {depth:3}
        },
        {
            path: 'add-edit-gst-tax-type/:id',
            component: AddEditGstTaxTypeComponent,
              data: {depth:4}
        },
        {
            path: 'add-edit-gst-tax-type',
            component: AddEditGstTaxTypeComponent,
              data: {depth:4}
        }]
    }
];
