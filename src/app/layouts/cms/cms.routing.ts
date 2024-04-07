import { CatalogueProductsComponent } from './catelog/catalogue-products/catalogue-products.component';
import { CatelogComponent } from './catelog/catelog.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { Routes } from '@angular/router';
import { SliderComponent } from './slider/slider.component';
import { CollectionComponent } from './collection/collection.component';

import { BlockbannerComponent } from './blockbanner/blockbanner.component';

export const crmRoutes: Routes = [
  { path: 'slider', component: SliderComponent, data: { depth: 3 } },
  {path: 'blockbanner',component: BlockbannerComponent,data: {depth:3}},
  { path: 'notification-list', component: NotificationListComponent, data: { depth: 3 } },
  { path: 'catalogue', component: CatelogComponent, data: { depth: 3 } },
  { path: 'catalogue/:id', component: CatalogueProductsComponent, data: { depth: 4 } },
  {path:'collection',component:CollectionComponent},
  { path: 'deals', loadChildren: () => import('./deals/deals.module').then(e => e.DealsModule), data: { depth: 3 } }

];

