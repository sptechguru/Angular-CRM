import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmUserRoutesModule } from './crm-user.routing';
import { RouterModule } from '@angular/router';
import { CrmUserListComponent } from './crm-user-list/crm-user-list.component';
import { AddCrmUserComponent } from './add-crm-user/add-crm-user.component';
import { ViewCrmUserDetailsComponent } from './view-crm-user-details/view-crm-user-details.component';
import { SharedModule } from 'app/shared/shared.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    CrmUserListComponent,
    AddCrmUserComponent,
    ViewCrmUserDetailsComponent
  ],
  imports: [
    CommonModule,
     RouterModule.forChild(CrmUserRoutesModule),
     SharedModule,
     MatSlideToggleModule
  ]
})
export class CrmUserModule { }
