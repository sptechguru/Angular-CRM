import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { InventoryManagementRoutesModule } from './inventory-management.routing';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(InventoryManagementRoutesModule),
    SharedModule,
    NgbModule
  ],
  declarations: [ ]
})

export class InventoryManagementModule { }
