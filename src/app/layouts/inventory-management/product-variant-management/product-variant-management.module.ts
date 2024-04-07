import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductVariantManagementRoutesModule } from './product-variant-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ProductVariantListComponent } from './product-variant-list/product-variant-list.component';
import { AddEditProductVariantComponent } from './add-edit-product-variant/add-edit-product-variant.component';
import { ProductVariantDetailsComponent } from './product-variant-details/product-variant-details.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';  
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CKEditorModule,
    RouterModule.forChild(ProductVariantManagementRoutesModule),
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatSlideToggleModule
  ],
  declarations: [
    ProductVariantListComponent,
    AddEditProductVariantComponent,
    ProductVariantDetailsComponent
  ]
})

export class ProductVariantManagementModule { }
