import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersManagementRoutesModule } from './users-management.routing';
import { SharedModule } from 'app/shared/shared.module';
import {  UsersListComponent } from './users-list/users-list.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AssignToUserComponent } from './users-list/assign-to-user/assign-to-user.component';
import { AddCrmBulkComponent } from './users-list/add-crm-bulk/add-crm-bulk.component';
import {MatListModule} from '@angular/material/list';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsersManagementRoutesModule),
    SharedModule,
    MatAutocompleteModule,
    Ng2SearchPipeModule,
    MatListModule,
    MatCheckboxModule 
  ],
  declarations: [
    UsersListComponent,
    AddEditUserComponent,
    ViewUserComponent,
    AssignToUserComponent,
    AddCrmBulkComponent,
  ],
  entryComponents:[AssignToUserComponent]
})

export class UsersManagementModule { }
