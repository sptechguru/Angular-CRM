import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BusinessTypeManagementRoutesModule } from './business-type-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessTypeListComponent } from './business-type-list/business-type-list.component';
import { AddEditBusinessTypeComponent } from './add-edit-business-type/add-edit-business-type.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(BusinessTypeManagementRoutesModule),
    SharedModule
  ],
  declarations: [
    AddEditBusinessTypeComponent,
    BusinessTypeListComponent,
  ]
})

export class BusinessTypeManagementModule { }
