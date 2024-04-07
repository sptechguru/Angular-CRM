import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartnerManagementRoutesModule } from './partner-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { AddEditPartnerComponent } from './add-edit-partner/add-edit-partner.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(PartnerManagementRoutesModule),
    SharedModule
  ],
  declarations: [
    AddEditPartnerComponent,
    PartnerListComponent,
  ]
})

export class PartnerManagementModule { }
