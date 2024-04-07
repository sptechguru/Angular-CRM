import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { DataLoaderComponent } from './components/loader/data.loader.component';
import { CapitalizeFirstPipe, CustomDatePipe } from './pipes/custom-data-filters.pipe';
import { CommonSortComponent } from './components/sort/common-sort.component';
import { CommonSearchComponent } from './components/search/common-search.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AppNgbPaginationComponent } from './components/app-ngb-pagination/app-ngb-pagination.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { StockupdateDialogComponent} from './components/stockupdate-dialog/stockupdate-dialog.component';
import { DialogOverviewExampleDialog } from 'app/layouts/users-management/users-list/users-list.component';
import { DialogOverviewExampleDialogs } from 'app/layouts/kyc-management/kyc-details/kyc-details.component';
import { DialogElementsExampleDialog } from 'app/layouts/kyc-management/kyc-details/kyc-details.component';


import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatDaterangepickerModule } from 'mat-daterangepicker';
import {MatChipsModule} from '@angular/material/chips';
// RECOMMENDED
import { Daterangepicker } from 'ng2-daterangepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {MatMenuModule} from '@angular/material/menu';
// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PickDateRangComponent } from './components/pick-date-rang/pick-date-rang.component';
import { NumberInputDirective } from './directive/number-input.directive';
import {MatStepperModule} from '@angular/material/stepper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
     MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    Daterangepicker,
    MatRippleModule,
    MatFormFieldModule,
//  MatDaterangepickerModule,
MatIconModule,
    MatChipsModule,
BsDropdownModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule,
    PaginationModule.forRoot(),
     BsDatepickerModule.forRoot(),
     MatStepperModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    BsDropdownModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatButtonModule,
    MatPaginatorModule,
    MatMenuModule,
    MatRippleModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    CommonSearchComponent,
    CommonSortComponent,
    DataLoaderComponent,
    AppNgbPaginationComponent,
    ConfirmationDialogComponent,
    StockupdateDialogComponent,
    CustomDatePipe,
    CapitalizeFirstPipe,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialogs,
    DialogElementsExampleDialog,
    PickDateRangComponent,
    NumberInputDirective,
    MatStepperModule
    //  PaginationModule.forRoot(),
  ],
  declarations: [
    CommonSearchComponent,
    CommonSortComponent,
    DataLoaderComponent,
    AppNgbPaginationComponent,
    ConfirmationDialogComponent,
    DialogOverviewExampleDialogs,
    DialogElementsExampleDialog,
    StockupdateDialogComponent,
    CustomDatePipe,
    PickDateRangComponent,
    CapitalizeFirstPipe,
    LoaderComponent,
    DialogOverviewExampleDialog,
    DialogOverviewExampleDialogs,
    NumberInputDirective
  ],
  providers: [
  ],
  entryComponents: [ConfirmationDialogComponent,
    StockupdateDialogComponent,
    DialogOverviewExampleDialog,DialogOverviewExampleDialogs,DialogElementsExampleDialog],
})
export class SharedModule { }
