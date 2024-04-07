import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactQueriesRoutesModule } from './contact-queries.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactQueryListComponent } from './contact-query-list/contact-query-list.component';
import { ContactQueryDetailsComponent } from './contact-query-details/contact-query-details.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ContactQueriesRoutesModule),
    SharedModule
  ],
  declarations: [
    // AddEditGstTaxTypeComponent,
    ContactQueryListComponent,
    ContactQueryDetailsComponent
  ]
})

export class ContactQueriesModule { }
