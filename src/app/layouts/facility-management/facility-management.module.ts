import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FacilityManagementRoutesModule } from './facility-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { FacilityListComponent } from './facility-list/facility-list.component';
import { AddEditFacilityComponent } from './add-edit-facility/add-edit-facility.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(FacilityManagementRoutesModule),
    SharedModule
  ],
  declarations: [
    AddEditFacilityComponent,
    FacilityListComponent,
  ]
})

export class FacilityManagementModule { }
