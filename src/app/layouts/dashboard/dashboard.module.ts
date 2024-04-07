import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardRoutesModule } from './dashboard.routing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PickDateRangComponent } from 'app/shared/components/pick-date-rang/pick-date-rang.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutesModule),
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
  SharedModule,
    MatInputModule
  ],
  declarations: [
    DashboardComponent,
    
  ]
})

export class DashboardModule { }
