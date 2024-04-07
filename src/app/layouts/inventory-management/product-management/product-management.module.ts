import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductManagementRoutesModule } from './product-management.routing';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatStepperModule} from '@angular/material/stepper';
import { ProductBasicInformationComponent } from './add-new-product/product-basic-information/product-basic-information.component';
import { ProductShipingComponent } from './add-new-product/product-shiping/product-shiping.component';
import { QuillModule } from 'ngx-quill'
import { NewProductDetailsComponent } from './add-new-product/new-product-details/new-product-details.component';
import { ProductPriceComponent } from './add-new-product/product-price/product-price.component';
import { ProductSpecificationComponent } from './add-new-product/product-specification/product-specification.component';
import { ProductCatalogueComponent } from './add-new-product/product-catalogue/product-catalogue.component';
import { ProductConfigrationComponent } from './add-new-product/product-configration/product-configration.component';
import { ProductVarientComponent } from './add-new-product/product-varient/product-varient.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatChipsModule} from '@angular/material/chips';
import { ActionComponent } from './add-new-product/action/action.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { ProductImageComponent } from './add-new-product/product-image/product-image.component';
import { NewVariantComponent } from './add-new-product/new-variant/new-variant.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { VarientLeadComponent } from './add-new-product/varient-lead/varient-lead.component';
import { VarientOfferComponent } from './add-new-product/varient-offer/varient-offer.component';
import { VarientImageComponent } from './add-new-product/varient-image/varient-image.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CreateProductXlsComponent } from './xls/create-product-xls/create-product-xls.component';
import {MatTabsModule} from '@angular/material/tabs';
import { FileSaverModule } from 'ngx-filesaver';
@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(ProductManagementRoutesModule),
    SharedModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatStepperModule,
    MatCheckboxModule,
    MatDividerModule,
    MatChipsModule,
    QuillModule.forRoot(),
    MatToolbarModule,
    NgxSpinnerModule,
    MatTabsModule,
    FileSaverModule,
    CKEditorModule
  ],
  declarations: [
    AddEditProductComponent,
    ProductListComponent,
    ProductDetailsComponent,
    AddNewProductComponent,
    ProductBasicInformationComponent,
    ProductShipingComponent,
    NewProductDetailsComponent,
    ProductPriceComponent,
    ProductSpecificationComponent,
    ProductCatalogueComponent,
    ProductConfigrationComponent,
    ProductVarientComponent,
    ActionComponent,
    ProductImageComponent,
    NewVariantComponent,
    VarientLeadComponent,
    VarientOfferComponent,
    VarientImageComponent,
    CreateProductXlsComponent,
    
  ]
})

export class ProductManagementModule { }
