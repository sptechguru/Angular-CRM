import { RequsetCallBackComponent } from './requset-call-back.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
const routes: Routes = [
  { path: 'customer', component: RequsetCallBackComponent },
  { path: 'reseller', component: RequsetCallBackComponent }
]

@NgModule({
  declarations: [
    RequsetCallBackComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class RequsetCallBackModule { }
