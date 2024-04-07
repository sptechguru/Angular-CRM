import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResellerRequestsComponent } from './reseller-requests/reseller-requests.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ResellerRequestsQuoteComponent } from './reseller-requests-quote/reseller-requests-quote.component';
import { ResellerSupportComponent } from './reseller-support/reseller-support.component';
import { ResellerFeedbackComponent } from './reseller-feedback/reseller-feedback.component';

const route : Routes = [
  {path:'reseller-request',component:ResellerRequestsComponent},
  {path:'reseller-request-with-quote',component:ResellerRequestsQuoteComponent},
  {path:'reseller-support',component:ResellerSupportComponent},
  {path:'reseller-feedback',component:ResellerFeedbackComponent}
]

@NgModule({
  declarations: [ResellerRequestsComponent, ResellerRequestsQuoteComponent, ResellerSupportComponent, ResellerFeedbackComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class CustumerManegmentModule { }
