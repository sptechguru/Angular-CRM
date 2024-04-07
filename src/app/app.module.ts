import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';

import { ComponentsModule } from './components/components.module';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { MatRadioModule } from '@angular/material/radio';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SharedProvidersModule } from './shared/shared.providers.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SliderComponent } from './layouts/cms/slider/slider.component';
import { NewwComponent } from './neww/neww.component';

import {MatBadgeModule} from '@angular/material/badge';
import { OrderManagementModule } from './layouts/order-management/order-management.module';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatBadgeModule,
    OrderManagementModule,
    SharedProvidersModule.forRoot(),
    ToastrModule.forRoot({
      preventDuplicates: true,
      maxOpened: 1,
      newestOnTop: true
    }),
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    }),
    MatRadioModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    PageNotFoundComponent,
    NewwComponent,   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
