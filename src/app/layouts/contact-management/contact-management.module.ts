import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './contact-list/contact-list.component';
import { Route } from '@angular/compiler/src/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

const route : Routes = [
{path : '' , component : ContactListComponent}
]

@NgModule({
  declarations: [ContactListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule,
  ]
})
export class ContactManagementModule { }
