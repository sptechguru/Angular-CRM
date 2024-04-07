import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { UrlService } from 'app/shared/services/url.service';

@Component({
  selector: 'app-product-variant-list',
  templateUrl: './product-variant-list.component.html',
  styleUrls: ['./product-variant-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})

export class ProductVariantListComponent implements OnInit {

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
  productId;
  status: any;
  offset: any;

  constructor(
    private router: Router,
     private _localStorage: StorageAccessorService,
      private urlService: UrlService,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public activeRoute: ActivatedRoute,
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
      this.productId = params['id'];
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
    this.getAllProductList();
    this.getAllProductVariantList(this.queryObject);
  }
  
  onItemSelect(item: any) {
  }
  saveToLocal(product){
    localStorage.setItem('variantData',JSON.stringify(product));
    localStorage.setItem('variantEditProductData',JSON.stringify(this.productId));
  }
  saveProductid(){
    localStorage.setItem('variantEditProductData',JSON.stringify(this.productId));
  }
  setAttributeData(id){
    let data = {
      type:'Variant',
      id:id,
      productId:this.productId
    }
    localStorage.setItem('setAttributeData',JSON.stringify(data));
  }
  deleteProductVariant(id: string,productName:string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete \'' + productName + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.PRODUCTVARIANT_DELETE + '/' + id;
        // Find index of object to be changed
        
        const indexToBeChanged = this.dataList.findIndex(
          entity => entity._id === id
        );
          // start loader
          this.isListLoading = false;
          this.apiHandlerService.apiPost(url, null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                this.getAllProductVariantList({page: this.currentPage,search_text: ''});
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

  getAllProductVariantList(data) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.PRODUCTVARIANT_LIST + '/' + this.productId;
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      this.offset = (data.page - 1) * limit;
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

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllProductVariantList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllProductVariantList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllProductVariantList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllProductVariantList(this.queryObject);
    }
  };

  statusUpdate(e, id, name){
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to update status of \'' + name + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if(e == 'active'){
        this.status = 'inactive';
      }else if(e == 'inactive'){
        this.status = 'active';
      }
      if(this.status){
      if (result) {
            const url = API.ADMIN_USER_ENDPOINTS.UPDATE_VARIANT_STATUS+'/'+id+'/'+this.status;
            this.apiHandlerService.apiPost(url, {}, {}).subscribe({
              next: (data) => {
                if (data.success) {
                  if(this.queryObject.page){
                    this.queryObject = {
                      page: this.queryObject.page,
                      search_text: ''
                    }
                  }else{
                    this.queryObject = {
                      page: 1,
                      search_text: ''
                    }
                  }
                  this.getAllProductList();
                  this.getAllProductVariantList(this.queryObject);
                  this.toasterService.Success(data.message);
                } else {
                  if (data.error && data.error.message) {
                    this.toasterService.Error(data.error.message);
                  } else if (data.error && (data.error.length > 0)) {
                    data.error.forEach(erroObj => {
                      this.toasterService.Error(erroObj.msg);
                    });
                  } else {
                    this.toasterService.Error('Something went wrong.');
                  }
                }
              },
              error: (err) => {
                if (typeof err == 'string') {
                  this.toasterService.Error(err);
                } else if (err.error && err.error.message) {
                  this.toasterService.Error(err.error.message);
                }
              },
              complete: () => {
              }
            });
        }
      }else{
        this.toasterService.Error('Product variant status is pending');
      } 
    });  
  } 

    ngOnDestroy(): void {
    this._localStorage.setPage = { productVarientList: JSON.stringify(this.queryObject) };
    //  this.routerSub.unsubscribe();
  }
}
