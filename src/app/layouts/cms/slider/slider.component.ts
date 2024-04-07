import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { CreateNotificationComponent } from '../create-notification/create-notification.component';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { CropImageComponent } from './crop-image/crop-image.component';
import { FormControl, Validators } from '@angular/forms';

function clearFileInput(ctrl) {
  try {
    ctrl.value = null;
  } catch (ex) { }
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [ConfirmationDialogHandlerService]

})
export class SliderComponent implements OnInit {
  loading = false;
  ngOnInit() {
    this.getImage('android');
    this.getProductCategories('');
    this.getDeals();
    this.getRoadBanner();

  }
  constructor(
    private _api: ApiHandlerService,
    private _toaster: ToasterService,
    private _dialog: ConfirmationDialogHandlerService,
    public dialog: MatDialog
  ) { }
  fileToUpload: File = null;
  category_id: any
  product_id: any

  product_variant_id
  product_variant_id_list: [any]
  deal_id: any
  webSlides = [];
  iosSlides = [];
  androidSlides = [];
  otherSlidebar = [];
  selectedValue: string = 'slidebar';
  devices: 'web' | 'ios' | 'android' = 'android';

  nav: 'Deal' | 'Product' | 'category' | '';
  slideConfig = { "slidesToShow": 1, "slidesToScroll": 1 };


  list = [
    { value: 'slidebar', viewValue: 'Header Slider (Android:1050 * 415,Web:1920*280)' },
    { value: 'slidebar1', viewValue: 'Body Slider  (Android:215 * 195,Web:600*450)' },
    { value: 'imagebar1', viewValue: 'Header Banner(Android:799 * 273,Web:1798*218)' },
    { value: 'imagebar2', viewValue: 'Imagebar 2   (Android:799 * 273,Web:1920 * 450)' },
    { value: 'imagebar3', viewValue: 'Imagebar 3   (Android:799 * 273,Web:1920 * 450)' },
    { value: 'imagebar4', viewValue: 'Imagebar 4   (Android:799 * 273,Web:1920 * 450)' },
    { value: 'imagebar5', viewValue: 'Imagebar 5   (Android:799 * 273,Web:1920 * 450)' },
    { value: 'imagebar6', viewValue: 'Imagebar 6   (Android:215 * 195,Web:1920 * 450)' },
    { value: 'roadbanner', viewValue: 'Imagebar 6   (Android:215 * 195,Web:1920 * 450)' },

    // {value: 'imagebar7', viewValue: 'Imagebar 7'},
  ];

  devicesList = [
    { value: 'android', viewValue: 'Android slider' },
    { value: 'web', viewValue: 'Web slider' },

  ]
  navList = [
    { value: '', viewValue: 'Blank' },
    { value: 'category', viewValue: 'Category' },
    { value: 'Product', viewValue: 'Product' },
    { value: 'Deal', viewValue: 'Deal' },

  ]



  public adroidRedirectUrl = new FormControl('', Validators.pattern(urlRegex));
  public webRedirectUrl = new FormControl('', Validators.pattern(urlRegex));
  public roadRedirectUrl = new FormControl('', [Validators.pattern(urlRegex),Validators.required]);


  handleFileInput(files, type = 'web') {
    if (files.target.files.length === 0) return clearFileInput(document.getElementById("myFileInput"));

    console.log(this.size());


    this.dialog.open(CropImageComponent, {
      data: { files, type: this.size() },
      width: '100%',
      panelClass: 'crop-image-dialog'
    }).afterClosed().subscribe(data => {
      files = null


      if (data) this.croppedImage = data
      else clearFileInput(document.getElementById("myFileInput"));
    })
    // this.fileToUpload = files.item(0);
  }



  handleFileInputRoad(files) {
    if (files.target.files.length === 0) return clearFileInput(document.getElementById("myFileInput"));

    this.dialog.open(CropImageComponent, {
      data: { files, type: {height: 400, width: 670} },
      width: '100%',
      panelClass: 'crop-image-dialog'
    }).afterClosed().subscribe(data => {
      files = null
      if (data) this.fileToUpload = data
      else clearFileInput(document.getElementById("myFileInputRoad"));
    })
    // this.fileToUpload = files.item(0);
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

  uploadFile(devices: 'web' | 'ios' | 'android') {
    console.log(this.adroidRedirectUrl.value);

    if (!this.croppedImage) return;
    const endpoint = API.CRM_ENDPOINTS.ULOAD_SLIDER_IMAGE;
    this.loading = true
    const formData: FormData = new FormData();
    formData.append('cms_files', this.croppedImage, this.croppedImage.name);
    formData.append('image_url', this.adroidRedirectUrl.value);
    formData.append('file_type', 'images');
    formData.append('content_type', this.selectedValue);
    formData.append('device_type', devices);
    formData.append('banner_for', this.nav);
    this.category_id && formData.append('category_id', this.category_id ? this.category_id : '');
    this.product_id && formData.append('product_id', this.product_id ? this.product_id : '');
    this.product_variant_id && formData.append('product_variant_id', this.product_variant_id ? this.product_variant_id : '');
    this.deal_id && formData.append('deal_id', this.deal_id ? this.deal_id : '');
    this._api.apiPost(endpoint, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
      next: next => {
        this._toaster.Success(next.message)
        clearFileInput(document.getElementById("myFileInput"));
        this.getImage(devices);
        this.croppedImage = null;
        this.category_id = null;
        this.productList = [];
        this.product_id = null;
        this.nav = null;
        this.adroidRedirectUrl.reset();
        this.deal_id = null;
        this.loading = false
      },
      error: err => {
        // console.log(err)
        this.loading = false;
        this._toaster.Error(err.error.message)

      },
      complete: () => {

      }
    })
  }
  loadingROAD = false;
  uploadFileRoad(devices: 'web' | 'ios' | 'android') {
  

    if (!this.fileToUpload) return;
    const endpoint = API.CRM_ENDPOINTS.ROAD_BLOCKER_IMAGE;
    this.loadingROAD = true
    const formData: FormData = new FormData();
    formData.append('banner_image', this.fileToUpload, this.fileToUpload.name);
    formData.append('banner_url', this.roadRedirectUrl.value);
   
   
    this._api.apiPost(endpoint, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
      next: next => {
        this._toaster.Success(next.message)
        clearFileInput(document.getElementById("myFileInput"));
       
        this.fileToUpload = null;
       
        this.roadRedirectUrl.reset();
      
        this.loadingROAD = false
      },
      error: err => {
        // console.log(err)
        this.loadingROAD = false

      },
      complete: () => {

      }
    })
  }
  productList: Array<any> = []
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

  roadBannerImage;
  roadBannerImageUrl;
  getRoadBanner(){
    const url = API.CRM_ENDPOINTS.GET_ROAD_BANNER;

    this._api.apiGet(url).subscribe({
      next: next => {
        console.log(next);
        this.roadBannerImage = next.data?.rows[0].banner_image;
        this.roadBannerImageUrl = next.data?.rows[0].banner_url
        
      }
    })
  }

  size() {


    if (this.devices === 'android') {
      switch (this.selectedValue) {
        case 'slidebar':

          return { height: 415, width: 1050 };
        case 'slidebar1':

          return {
            height: 195, width: 215
          };

        case 'imagebar6':

          return { height: 415, width: 1050 };


        default:
          return { height: 415, width: 1050 };
      }
    }
    if (this.devices === 'web') {
      switch (this.selectedValue) {
        case 'slidebar':

          return {
            height: 280, width: 1920
          };
        case 'slidebar1':

          return {
            height: 450, width: 600
          };

        case 'imagebar1':

          return {
            height: 218, width: 1798
          };

        default:
          return {
            height: 450, width: 1920
          };
      }
    }
  }

  onselectionShildeChange() {
    this.imageChangedEvent = null;

    this.product_id = null;
    this.deal_id = null;
    this.category_id = null;
    this.nav = null;
    this.adroidRedirectUrl.reset();
    this.getImage('web')
  }


  onselectionChange() {
    this.imageChangedEvent = null;
    // this.devices = null;
    this.product_id = null;
    this.deal_id = null;
    this.category_id = null;
    this.nav = null;
    this.getImage('web')
  }

  deleteSliderImage(image, devices: 'web' | 'ios' | 'android') {
    this._dialog.openDialog({ title: 'Delete slider image', cancelText: 'Cancel', confirmText: 'Delete', question: 'Are sure you want to delete image?' }).subscribe(response => {
      if (!response) return;
      this._api.apiGet(API.CRM_ENDPOINTS.DELETE_SLIDER_IMAGE(image.id)).subscribe({
        next: next => {
          this._toaster.Success(next.message)
          this.getImage(devices);
        },
        error: err => {

        }
      })
      // console.log(image)
    })
  }

  getImage(devices: 'web' | 'ios' | 'android') {
    const api = API.CRM_ENDPOINTS.SLIDER_IMAGE;

    this._api.apiGet(api, { content_type: this.selectedValue }).subscribe({
      next: next => {
        console.log(next);
        // console.log(next.data.rows)
        const data: [any] = next.data.rows;

        this.webSlides = data.filter(x => x.device_type === 'web');
        console.log(this.webSlides);
        this.androidSlides = data.filter(x => x.device_type === 'android')
        this.otherSlidebar = data.filter(x => x.content_type !== 'slidebar')
        this.iosSlides = data.filter(x => x.device_type === 'ios')

      },
      error: err => {
        // console.log(err)
      },
      complete: () => {

      }
    })
  }

  openDialog() {
    this.dialog.open(CreateNotificationComponent);
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';


}
