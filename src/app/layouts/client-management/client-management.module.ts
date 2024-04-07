import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientManagementRoutesModule } from './client-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ClientListComponent } from './client-list/client-list.component';
import { AddEditClientComponent } from './add-edit-client/add-edit-client.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ClientManagementRoutesModule),
    SharedModule
  ],
  declarations: [
    AddEditClientComponent,
    ClientListComponent,
  ]
})

export class ClientManagementModule { }
