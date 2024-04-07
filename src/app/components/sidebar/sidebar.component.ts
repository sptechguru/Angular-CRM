import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { environment } from "environments/environment";
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  role: string;
  permmision: boolean
  children: Array<any>;
}

export const ROUTES: RouteInfo[] = [
  { path: 'dashboard', title: 'Dashboard', icon: 'dashboard', class: '', children: [], role: 'dashboard', permmision: true },
  // { path: 'kyc-list', title: 'Kyc List', icon: 'list', class: '',children:[] ,role:"kyc-list",permmision:true },
  // { path: 'contact-list', title: 'Contact Managment', icon: 'list', class: '',children:[] }
  { path: 'users-management', title: 'Customers', icon: 'list', class: '', children: [], role: "reseller-management", permmision: true },

  { path: 'create-user', title: 'Add Customer', icon: 'list', class: '', children: [], role: "Add Customer", permmision: true },

  { path: '', title: 'Reseller Quries', icon: 'list', class: '', children: [
    // { path: 'customer-management/reseller-request', title: 'Reseller Request', icon: 'business', class: '' },
    { path: 'customer-management/reseller-request-with-quote', title: 'Request For Quotation', icon: 'business', class: '' },
    { path: 'customer-management/reseller-support', title: 'Help & Support', icon: 'business', class: '' },
    { path: 'customer-management/reseller-feedback', title: 'Feedback', icon: 'business', class: '' },
    
  ], role: "crm-user", permmision: true },
  { path: 'order-management', title: 'Order Management', icon: 'shopping_cart', class: '', children: [], role: "order-management", permmision: true },

  // { path: 'create-order', title: 'create-order', icon: 'shopping_cart', class: '', children: [], role: "order-management", permmision: true },

  { path: 'category-management', title: 'Category Management', icon: 'category', class: '', children: [], role: "category-management", permmision: true },
  { path: 'client-management', title: 'Business Sectors', icon: 'supervisor_account', class: '', children: [], role: "business-sectors", permmision: true },
  { path: 'partner-management', title: 'Business Category', icon: 'how_to_reg', class: '', children: [], role: "business-category", permmision: true },
  { path: 'business-type-management', title: 'Business Types', icon: 'business', class: '', children: [], role: "business-type", permmision: true },
  { path: 'gst-tax-type-management', title: 'GST Tax Type', icon: 'category', class: '', children: [], role: "gst-tax-type", permmision: true },
  { path: 'facility-management', title: 'Facility Management', icon: 'category', class: '', children: [], role: "facility-management", permmision: true },
  { path: 'contact-queries', title: 'Contact Query', icon: 'category', class: '', children: [], role: "contact-query", permmision: true },
  {
    path: '', title: 'CMS', icon: 'category', class: '', children: [
      { path: 'cms/slider', title: 'Slider', icon: 'business', class: '' },
      { path: 'cms/deals', title: 'Deals', icon: 'business', class: '' },
      { path: 'cms/blockbanner',title:'BlockBanner', icon:'business',class:''},
      // { path: 'cms/catalogue', title: 'Catalogue', icon: 'business', class: '' },
      { path: 'cms/notification-list', title: 'Bulk Notification', icon: 'assignment', class: '' },
      {path:'cms/collection',title: 'Collection', icon: 'assignment', class: ''}
    ], role: "cms", permmision: true
  },

  {
    path: '', title: 'Inventory Management', icon: 'featured_play_list', class: '', role: "inventory-management", permmision: true,
    children: [
      { path: 'inventory-management/product-management', title: 'Products', icon: 'business', class: '' },
      { path: 'inventory-management/product-attribute-management', title: 'Product Attributes', icon: 'assignment', class: '' },
      { path: 'inventory-management/sku-management', title: 'Stock management', icon: 'business', class: '' },
      { path: 'inventory-management/trade-assurance',title:'Trade',icon:'business',class:''}

      // {path: '/crm/inventory-management/product-attribute-management/add-attribute-to-product', title: 'Add Attributes to Product', icon: 'assignment', class: ''},
      // {path: 'inventory-management/product-variant-management', title: 'Product Variants', icon: 'call_split', class: ''},
      // {path: 'inventory-management/product-variant-image-management', title: 'Product Variant Images', icon: 'call_split', class: ''}
    ]
  },
  {
    path: '', title: 'Shiping Management', icon: 'list', class: '', role: "shiping", permmision: true,children: [
      {path:'shiping-management/ready-stock',title:'Ready Stock',icon:'business',class:''},
      { path: 'shiping-management/delivery-management', title: 'Delivery Management', icon: 'business', class: '' },
    ]
  },
  


  

  { path: 'crm-user', title: 'CRM User', icon: 'list', class: '', children: [], role: "crm-user", permmision: true },
  // { path: 'menu-management', title: 'Menu Management', icon: 'list', class: '', children: [], role: "crm-user", permmision: true },
  { path: 'blog-management', title: 'Blog Management', icon: 'list', class: '', children: [], role: "crm-user", permmision: true },
  
  // { path: 'catelog-management', title: 'Catelog Management', icon: 'list', class: '', children: [], role: "crm-user", permmision: true },
  {
    path: '', title: 'Request Call Back', icon: 'list', class: '', role: "requset-call-back", permmision: true,
    children: [
      { path: 'requset-call-back/customer', title: 'Customer', icon: 'business', class: '' },
      { path: 'requset-call-back/reseller', title: 'Seller', icon: 'assignment', class: '' },
      // {path: '/crm/inventory-management/product-attribute-management/add-attribute-to-product', title: 'Add Attributes to Product', icon: 'assignment', class: ''},
      // {path: 'inventory-management/product-variant-management', title: 'Product Variants', icon: 'call_split', class: ''},
      // {path: 'inventory-management/product-variant-image-management', title: 'Product Variant Images', icon: 'call_split', class: ''}
    ]
  },
 
  //  { path: 'requset-call-back', title: 'Request Call Back', icon: 'category', class: '',children:[] , role:"requset-call-back",permmision:true },

  // { path: 'user-profile', title: 'User Profile', icon: 'person', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  menuItems: any[];

  constructor(private router: Router, private storage: StorageAccessorService) { }

  ngOnInit() {
    if (this.storage.fetchRole === 'admin') {
      this.menuItems = [...ROUTES]
      this.menuItems[this.menuItems.length - 1] = { ...this.menuItems[this.menuItems.length - 1], permmision: this.storage.crmUserPermissions }
    } else {
      this.menuItems = ROUTES.map(element => {
        return { ...element, permmision: this.storage.fetchRole.includes(element.role) }
      })
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }


}
