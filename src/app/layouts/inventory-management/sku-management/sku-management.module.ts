import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { skuManagementRoutesModule} from './sku-management.routing'
import {SkListComponent} from './sk-list/sk-list.component'
import { RouterModule } from '@angular/router';
import { NewSkuComponent } from './new-sku/new-sku.component';
import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { SkuXlsuploadComponent } from './sku-xlsupload/sku-xlsupload.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  declarations: [SkListComponent, NewSkuComponent, SkuXlsuploadComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    MatRadioModule,
    RouterModule.forChild(skuManagementRoutesModule),
    
  ]
})
export class SkuManagementModule { }
