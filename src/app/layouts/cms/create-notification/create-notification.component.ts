import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-create-notification',
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.css']
})
export class CreateNotificationComponent implements OnInit {

  constructor(
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public dialogRef: MatDialogRef<CreateNotificationComponent>,
  ) { }

  ngOnInit(): void {
    this.getProductCategories('');
    this.getDeals();
  }
  
  saving = false;
  nav: 'deal' | 'product' | 'category' | 'none' = 'none';
  navList = [
    { value: 'none', viewValue: 'None' },
    { value: 'category', viewValue: 'Category' },
    { value: 'product', viewValue: 'Product' },
    { value: 'deal', viewValue: 'Deal' },

  ]
  product_variant_id: any;
  category_id: any
  product_id: any
  deal_id: any
  title: string;
  message: string;
  redirection_url: string;
  type: 'save' | 'send';
  imageToUpload: File;

  handleFileInput(files: FileList) {
    this.imageToUpload = files.item(0);
  }


  createNotification(form: NgForm, type: 'save' | 'send') {
    const endpoint = API.CRM_ENDPOINTS.CREATE_NOTIFICATION;
    if (form.invalid) return;
    this.saving = true;
    const formData: FormData = new FormData();
    if (this.imageToUpload) {
      formData.append('image', this.imageToUpload, this.imageToUpload.name);
    }
    formData.append('title', this.title);
    formData.append('message', this.message);
    formData.append('redirection_url', this.redirection_url);
    formData.append('type', type);
    formData.append('banner_for', this.nav || '');
    formData.append('category_id', this.category_id ? this.category_id : '0');
    formData.append('product_id', this.product_id ? this.product_id : '0');
    formData.append('deal_id', this.deal_id ? this.deal_id : '0');
    this.product_variant_id && formData.append('product_variant_id', this.product_variant_id ? this.product_variant_id : '');
    this._api.apiPost(endpoint, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
      next: next => {
        // console.log(next);
        this.toaster.Success(next.message)
        this.dialogRef.close(true);
        this.saving = false;

      },
      error: err => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err)

        this.saving = false;
      },
      complete: () => {
        this.saving = false;

      }
    })



  }

  categories: Array<any> = [];

  getProductCategories(search_text) {
    const limit = 100;
    let pageObj = {
      search_text: search_text,
    };
    pageObj["limit"] = limit;
    pageObj["offset"] = 0;
    this._api.apiGet(API.CRM_ENDPOINTS.CATEGORY_LIST, pageObj).subscribe({
      next: next => {
        // // console.log(next);
        this.categories = next.data.rows

      },
      error: err => {
        // console.log(err);

      },
      complete: () => {

      }
    })
  }
  productList: Array<any> = [{ id: 0, product_name: '' }]
  getProduct(id) {
    this.productList = [];
    this.product_id = null;
    this._api.apiPost(API.CRM_ENDPOINTS.GET_FILTER_PRODUCT, { category_ids: [id] }).subscribe({
      next: next => {
        // console.log(next);
        this.productList = next.data.rows
        // let id = this.productList.map(data => {
        //   return data.product_variants.map(x => {
        //     // console.log();

        //     return x;
        //   })
        // }) as any;
        // this.productList = id.flat(1);
        console.log();
        console.log(this.productList);


      },
      error: err => {
        // console.log(err);

      },
      complete: () => {

      }
    })
  }
  deals: Array<any> = [];

  get product_variant_list() {

    if (!this.productList.find(x => x.id === this.product_id)) return [];

    return this.productList.find(x => x.id === this.product_id)?.product_variants

  }

  getDeals() {
    const url = API.CRM_ENDPOINTS.GET_DEALS_NAME;
    const limit = 20;
    let pageObj = {


    };
    pageObj["limit"] = limit;
    pageObj["offset"] = (1 - 1) * limit;

    this._api.apiGet(url, pageObj).subscribe({
      next: next => {
        // console.log(next);
        this.deals = next.data.rows

      },
      error: err => {
        // console.log(err);

      },
      complete: () => {

      }
    })
  }

  onselectionChange() {
    // this.imageChangedEvent = null;
    // this.getImage('web')
  }
}
