

import { Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';

export const CreateUserManagementRoutesModule: Routes = [
    {
        path: '',
        children: [{
            path: '',
            component: CreateUserComponent,

        },
    ]
    }
];
