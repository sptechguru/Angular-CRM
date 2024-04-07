import { DealsInfoComponent } from './deals-info/deals-info.component';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatListModule} from '@angular/material/list';
import { DealsProductsComponent } from './deals-products/deals-products.component';
import { DealsComponent } from './deals.component';
import { SharedModule } from 'app/shared/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';

const route :Routes =[
  {path : '' , component: DealsComponent},
  {path : ':id' , component: DealsInfoComponent,   data: {depth:4}}
]



@NgModule({
  declarations: [
    DealsComponent,
    DealsInfoComponent,
    DealsProductsComponent
  ],
  imports: [
      CommonModule,
      RouterModule.forChild(route),
     SharedModule,
     DragDropModule,
     MatCheckboxModule,
      MatProgressSpinnerModule,
      MatExpansionModule,
      Ng2SearchPipeModule,
      MatCardModule,
      MatListModule
      
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DealsModule { }
