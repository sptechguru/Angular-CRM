import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tradeAssuranceRoutesModule} from './trade-assurance.routing'

import { RouterModule } from '@angular/router';

import { FormGroup,ReactiveFormsModule  }  from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

import { NgxSpinnerModule } from 'ngx-spinner';
import { TradeassuranceListComponent } from './tradeassurance-list/tradeassurance-list.component';
@NgModule({
  declarations: [TradeassuranceListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(tradeAssuranceRoutesModule),
    
  ]
})
export class TradeAssuranceModule { }
