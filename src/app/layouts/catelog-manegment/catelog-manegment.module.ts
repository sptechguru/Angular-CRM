import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatelogManegmentComponent } from './catelog-manegment.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { CreateCatelogComponent } from './create-catelog/create-catelog.component';

const route : Routes = [
  {path:'',component:CatelogManegmentComponent}
]

@NgModule({
  declarations: [CatelogManegmentComponent, CreateCatelogComponent],
  entryComponents:[CreateCatelogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule
  ]
})
export class CatelogManegmentModule { }
