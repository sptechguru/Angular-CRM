import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryManagementRoutesModule } from './category-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { OrderDetailsComponent } from './order-details/order-details.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(CategoryManagementRoutesModule),
    SharedModule
  ],
  declarations: [
    AddEditCategoryComponent,
    CategoryListComponent,
    OrderDetailsComponent
  ]
})

export class CategoryManagementModule { }
