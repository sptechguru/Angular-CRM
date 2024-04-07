import { Routes } from '@angular/router';
import { AddCrmUserComponent } from './add-crm-user/add-crm-user.component';
import { CrmUserListComponent } from './crm-user-list/crm-user-list.component';
import { ViewCrmUserDetailsComponent } from './view-crm-user-details/view-crm-user-details.component';

export const CrmUserRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: CrmUserListComponent
        },
        {
            path: 'add-crm-user',
            component: AddCrmUserComponent
        },
          {
            path: 'crm-user-details/:id',
            component: ViewCrmUserDetailsComponent
        },
        
       
        ]
    }
];
