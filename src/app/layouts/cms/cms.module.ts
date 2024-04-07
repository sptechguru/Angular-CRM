import { SharedModule } from './../../shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';
import {  crmRoutes } from './cms.routing';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ImageCropperModule } from 'ngx-image-cropper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CreateNotificationComponent } from './create-notification/create-notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatListModule} from '@angular/material/list';

import { DealsModule } from './deals/deals.module';
import { CropImageComponent } from './slider/crop-image/crop-image.component';
import { CatelogComponent } from './catelog/catelog.component';
import { CatalogueProductsComponent } from './catelog/catalogue-products/catalogue-products.component';
import { CollectionComponent } from './collection/collection.component';
import { AddCollectionComponent } from './collection/add-collection/add-collection.component';
import { BlockbannerComponent } from './blockbanner/blockbanner.component';
@NgModule({
  declarations: [
    CreateNotificationComponent,
    NotificationListComponent,
    SliderComponent,
    CropImageComponent,
    CatelogComponent,
    CatalogueProductsComponent,
    CollectionComponent,
    AddCollectionComponent,
    BlockbannerComponent,
  ],
  imports: [
      CommonModule,
      RouterModule.forChild(crmRoutes),
      SharedModule,
      SlickCarouselModule,
      MatProgressSpinnerModule,
      MatExpansionModule,
      Ng2SearchPipeModule,
      MatCardModule,
      MatListModule,
      ImageCropperModule
      
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  entryComponents:[CreateNotificationComponent,CropImageComponent,AddCollectionComponent]
})
export class CmsModule { }
