import { data } from 'jquery';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { UrlService } from 'app/shared/services/url.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class ProductListComponent implements OnInit {

  dataList: Array<any> = [];
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
  status: any;
  offset: any;
  notficationdata:any;
  totalcount:boolean = false;
  prodcutdata:any = '';
  coloumList=[{name:'Product Name',value:'product_name'},
    {name:'Description',value:'product_description'} ,
    {name:'Status',value:'status'},
    {name:'Created At',value:'created_at'}, 
    {name:'Variant Name',value:'variant_name'}, 
    {name:'GST',value:'gst'}, 
    {name:'Variant Quantity',value:'quantity'}, 
    {name:'SKU Code',value:'sku_code'},
    {name:'HSN Code',value:'hsn_code'}]
  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
     private urlService: UrlService,
      private _localStorage: StorageAccessorService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    private spinner: NgxSpinnerService,
    private _FileSaverService: FileSaverService
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
    this.urlService.previousUrl$
      .subscribe((previousUrl: string) => {
        if (!previousUrl) this.page = 1;
         this.queryObject = {
          page:1,
        search_text: "",
        };
        if (previousUrl && previousUrl.split("/")[3] === "product-management") {
          this.queryObject = JSON.parse(this._localStorage.getPage.productManagement);
        }
 this.getAllProductList(this.queryObject);
           })
      .unsubscribe();
      this.getProdcutcountList();
      this.getProdcutsNotification();
     
  }

  getProdcutcountList(){
    const url = API.CRM_ENDPOINTS.PRODCUT_COUNT_TOTAL_ORDERS
    this.apiHandlerService.apiGet(url).subscribe((res)=>{
      this.prodcutdata = res.data;
      // console.log(this.totalorder);
    } ,error =>{
      // console.log(error);
      this.toasterService.Error(error);
    })
  }
  

  getActiveProdcuts(){
    const url = API.CRM_ENDPOINTS.PRODCUT_COUNT_EXCEL_SHEET;
    let payload = {
     status:'active'
    }
    this.apiHandlerService.apiGet(url,payload).subscribe((res)=>{
      // console.log(res.data);
      window.open(res.data.link,'_blank');
      this.toasterService.Success(res.message);

    } ,error =>{
      // console.log(error);
      this.toasterService.Error(error);
    })
  }

  getProdcutsNotification(){
    const url = API.CRM_ENDPOINTS.PRODCUT_VARIANTS_NOTIFICATION;
    this.apiHandlerService.apiGet(url).subscribe((res)=>{
      // console.log(res.data);
      this.totalcount = true;
      this.notficationdata = res.data

      // this.toasterService.Success(res.message);

    } ,error =>{
      // console.log(error);
      this.toasterService.Error(error);
    })
  }

  getInActiveProdcuts(){
    const url = API.CRM_ENDPOINTS.PRODCUT_COUNT_EXCEL_SHEET;
    let payload = {
     status:'inactive'
    }
    this.apiHandlerService.apiGet(url,payload).subscribe((res)=>{
      // console.log(res.data);
      window.open(res.data.link,'_blank');
      this.toasterService.Success(res.message);

    } ,error =>{
      // console.log(error);
      this.toasterService.Error(error);
    })
  }


  saveToLocal(product){
    localStorage.setItem('productData',JSON.stringify(product));
  }

  /*deleteProduct(id: string,productName:string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete \'' + productName + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.PRODUCT_DELETE + '/' + id;
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
                this.getAllProductList({page: this.currentPage,search_text: ''});
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
  }*/

  getAllProductList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.PRODUCT_LISTS;
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      this.offset = (data.page - 1) * limit;
      if (data.sortFied && data.orderBy) {
        pageObj['sort_field'] = data.sortFied;
        pageObj['order_by'] = data.orderBy;
      }
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
           // this.dataList = this.dataList.concat();
          } else {
            this.dataList = [];
          }
          this.totalQueryableData = resultData.total;
          if(data.page){
            this.page = data.page;
          }else{
            this.page = 1;
          }
          this.isListLoading = false;
        },

        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
          this.isListLoading = false;
        },

        complete: () => {
          this.isListLoading = false;
          this.isStatusBtnEnabled = true;
        }
      });
    }
  }

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllProductList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllProductList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllProductList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllProductList(this.queryObject);
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
      if(result) {
            const url = API.ADMIN_USER_ENDPOINTS.UPDATE_PRODUCT_STATUS+'/'+id+'/'+this.status;
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
                  
                  this.getAllProductList(this.queryObject);
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
        this.toasterService.Error('Product status is pending');
      }
    });   
  } 

  generateXLS(select,link:HTMLAnchorElement){
    // console.log(select);
    if(select ==undefined || select.length == 0){
      this.toasterService.Error('Please select atleast 1 field');
      return ;
    }
    const req={data:select};
    
    let url = API.CRM_ENDPOINTS.PRODUCT_XLS;
    this.spinner.show();
    this.apiHandlerService.apiPost(url, req,{}).subscribe({
    next: (data) => {
      // console.log(data);
      this.spinner.hide();
      if (data.success) {
        this.toasterService.Success(data.message);
        window.open(data.data.link,'_blank');
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
      this.spinner.hide();
    //  console.log(err); 
    },
  });

  }
  ngOnDestroy(): void {
    this._localStorage.setPage = { productManagement: JSON.stringify(this.queryObject) };
    //  this.routerSub.unsubscribe();
  }

}
