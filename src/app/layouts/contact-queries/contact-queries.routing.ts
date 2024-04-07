import { Routes } from '@angular/router';
import { ContactQueryDetailsComponent } from './contact-query-details/contact-query-details.component';
import { ContactQueryListComponent } from './contact-query-list/contact-query-list.component';

export const ContactQueriesRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: ContactQueryListComponent,
              data: {depth:3}
        },
        {
            path: 'contact-query-details/:id',
            component: ContactQueryDetailsComponent,
              data: {depth:4}
        },
            // {
            //     path: 'add-edit-gst-tax-type',
            //     component: AddEditGstTaxTypeComponent
            // }
        ]
    }
];
