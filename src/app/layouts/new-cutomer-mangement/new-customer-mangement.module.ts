

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { FormGroup,FormsModule,ReactiveFormsModule  }  from '@angular/forms';
import { CreateUserManagementRoutesModule } from './new-customer-mangement-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(CreateUserManagementRoutesModule),
    SharedModule,
    MatFormFieldModule,
    MatTabsModule,
    NgxMatSelectSearchModule
  ],
  declarations: [
    CreateUserComponent,
  ]
})

export class NewCustomerMangementModule { }
