import { Routes } from '@angular/router';
import { AddEditFacilityComponent } from './add-edit-facility/add-edit-facility.component';
import { FacilityListComponent } from './facility-list/facility-list.component';

export const FacilityManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: FacilityListComponent,
             data: {depth:3}
        },
        {
            path: 'add-edit-facility/:id',
            component: AddEditFacilityComponent,
              data: {depth:4}
        },
        {
            path: 'add-edit-facility',
            component: AddEditFacilityComponent,
              data: {depth:4}
        }]
    }
];
