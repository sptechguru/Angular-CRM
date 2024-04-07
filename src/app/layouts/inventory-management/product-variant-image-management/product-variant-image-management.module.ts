import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductVariantImageManagementRoutesModule } from './product-variant-image-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ProductVariantImageListComponent } from './product-variant-image-list/product-variant-image-list.component';
import { AddEditProductVariantImageComponent } from './add-edit-product-variant-image/add-edit-product-variant-image.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ProductVariantImageManagementRoutesModule),
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ProductVariantImageListComponent,
    AddEditProductVariantImageComponent,
  ]
})

export class ProductVariantImageManagementModule { }
