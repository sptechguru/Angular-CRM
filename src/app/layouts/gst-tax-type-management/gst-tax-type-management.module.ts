import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GstTaxTypeManagementRoutesModule } from './gst-tax-type-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { AddEditGstTaxTypeComponent } from './add-edit-gst-tax-type/add-edit-gst-tax-type.component';
import { GstTaxTypeListComponent } from './gst-tax-type-list/gst-tax-type-list.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(GstTaxTypeManagementRoutesModule),
    SharedModule
  ],
  declarations: [
    AddEditGstTaxTypeComponent,
    GstTaxTypeListComponent,
  ]
})

export class GstTaxTypeManagementModule { }
