import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KycManagementRoutesModule } from './kyc-management.routing';
import { SharedModule } from 'app/shared/shared.module';
import { KycListComponent } from './kyc-list/kyc-list.component';
import { KycDetailsComponent } from './kyc-details/kyc-details.component';
import {MatDividerModule} from '@angular/material/divider';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
//import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(KycManagementRoutesModule),
    SharedModule,
    MatDividerModule,
    NgxExtendedPdfViewerModule
    //PdfViewerModule
  ],
  declarations: [
    KycListComponent,
    KycDetailsComponent
  ]
})

export class KycManagementModule { }
