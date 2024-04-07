import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductAttributeManagementRoutesModule } from './product-attribute-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ProductAttributeListComponent } from './product-attribute-list/product-attribute-list.component';
import { AddEditProductAttributeComponent } from './add-edit-product-attribute/add-edit-product-attribute.component';
import { AddAttributeToProductComponent } from './add-attribute-to-product/add-attribute-to-product.component';
import { AttributeValueListComponent } from './attribute-value-list/attribute-value-list.component';
import { FormGroup,ReactiveFormsModule,FormsModule  }  from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ProductAttributeManagementRoutesModule),
    SharedModule,FormsModule
  ],
  declarations: [
    AddEditProductAttributeComponent,
    ProductAttributeListComponent,
    AddAttributeToProductComponent,
    AttributeValueListComponent
  ]
})

export class ProductAttributeManagementModule { }
