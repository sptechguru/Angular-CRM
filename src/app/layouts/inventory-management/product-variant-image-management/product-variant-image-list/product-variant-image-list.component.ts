import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-product-variant-image-list',
  templateUrl: './product-variant-image-list.component.html',
  styleUrls: ['./product-variant-image-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})

export class ProductVariantImageListComponent implements OnInit {

  dataList: Array<any> = [];
  productList:Array<any> = [];
  new_status: string;
  loading: boolean
  sortByStatusObject: any;
  sortByUserTypeObject: any;
  queryObject: any;
  userService: any;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number;
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  currentPage = 1;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  variantId;
  image_Id: any;
  
  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public activeRoute: ActivatedRoute,
    private _location: Location
  ) {
    this.sortByStatusObject = [
      {
        key: 'active', value: 'Active'
      },
      {
        key: 'inactive', value: 'Inactive'
      }
    ];
    this.sortByUserTypeObject = [
      {
        key: 'service_provider', value: 'Service Provider'
      },
      {
        key: 'customer', value: 'Customer'
      }
    ];
  }

  ngOnInit() {
    
    this.activeRoute.params.subscribe(params => { 
      if(params['vid']){
        this.variantId = params['vid'];
      }
      if(params['Iid']){
        this.image_Id = params['Iid'];
      }
    });
    this.dropdownList = [
      { item_id: 1, item_text: 'Iphone 8' },
      { item_id: 2, item_text: 'Iphone 10' },
      { item_id: 3, item_text: 'Galaxy S10' },
      { item_id: 4, item_text: 'Galaxy S20' }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.queryObject = {
      page: 1,
      search_text: ''
    }
    this.getAllProductVariantImageList(this.queryObject);
    this.getAllProductList();
  }

  backClicked() {
    this._location.back();
  }
  
  onItemSelect(item: any) {
  }
  saveToLocal(product){
    localStorage.setItem('variantImageData',JSON.stringify(product));
  }

  saveVariant(){
    localStorage.setItem('variantData',JSON.stringify(this.variantId));
  }

  deleteVariantImage(id: string,imageUrl:string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete Image?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.PRODUCTVARIANTIMAGE_DELETE + '/' + id;        
        const indexToBeChanged = this.dataList.findIndex(
          entity => entity._id === id
        );
          this.isListLoading = false;
          this.apiHandlerService.apiPost(url, null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                this.getAllProductVariantImageList({page: this.currentPage,search_text: ''});
              } else {
                this.toasterService.Error();
              }
            },
            err => {
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
              }
              this.isListLoading = false;
              this.isStatusBtnEnabled = true;
            }
          );
      }
    });
  }

  getAllProductList() {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.PRODUCT_LIST;
      let pageObj = {
        search_text: ''
      };
      pageObj['limit'] = 5000;
      pageObj['offset'] = 0;
      this.currentPage = 1;
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.productList = resultData.rows;
            this.productList = this.productList.concat();
          } else {
            this.productList = [];
          }
          this.totalQueryableData = resultData.total;
          this.isListLoading = false;
        },

        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
          this.isListLoading = false;
        },

        complete: () => {
          this.isStatusBtnEnabled = true;
        }
      });
    }
  }

  getAllProductVariantImageList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.PRODUCTVARIANTIMAGE_LIST + '/' + this.image_Id;
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      this.currentPage = data.page;
      if (data.sortFied && data.orderBy) {
        pageObj['sort_field'] = data.sortFied;
        pageObj['order_by'] = data.orderBy;
      }
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            this.dataList = this.dataList.concat();
          } else {
            this.dataList = [];
          }
          this.totalQueryableData = resultData.total;
          this.page = data.page;
          this.isListLoading = false;
        },

        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
          this.isListLoading = false;
        },

        complete: () => {
          this.isStatusBtnEnabled = true;
        }
      });
    }
  }

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllProductVariantImageList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllProductVariantImageList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllProductVariantImageList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllProductVariantImageList(this.queryObject);
    }
  };

}
