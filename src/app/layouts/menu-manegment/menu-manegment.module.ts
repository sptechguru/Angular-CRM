import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuManegmentComponent } from './menu-manegment.component';
import { RouterModule, Routes } from '@angular/router';

const route : Routes = [
  {path:'',component:MenuManegmentComponent}
]

@NgModule({
  declarations: [MenuManegmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route)
  ]
})
export class MenuManegmentModule { }
