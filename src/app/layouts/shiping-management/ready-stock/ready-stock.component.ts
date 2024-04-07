import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UrlService } from 'app/shared/services/url.service';
import { TimeoutError } from 'rxjs';
import { AddReadyStockComponent } from './add-ready-stock/add-ready-stock.component';

@Component({
  selector: 'app-ready-stock',
  templateUrl: './ready-stock.component.html',
  styleUrls: ['./ready-stock.component.css']
})
export class ReadyStockComponent implements OnInit {


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

  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
     private urlService: UrlService,
      private _localStorage: StorageAccessorService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public dialog: MatDialog
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
      const url = API.SHIPING_ENDPOINTS.GET_READY_STOCK;
      const limit = this.pageSize || 10;
      let pageObj = {
        
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      this.offset = (data.page - 1) * limit;
   /*   if (data.sortFied && data.orderBy) {
        pageObj['sort_field'] = data.sortFied;
        pageObj['order_by'] = data.orderBy;
      }
      */
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          console.log(result);
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            this.dataList = this.dataList.concat();
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

  openDialog() {
    const dialog = this.dialog.open(AddReadyStockComponent).afterClosed().subscribe(response => {
      if (response) {
        this.getAllProductList(this.queryObject);
      }
    });
  }

  editStock(data){
    const dialog = this.dialog.open(AddReadyStockComponent,{data:data}).afterClosed().subscribe(response => {
      if (response) {
        this.getAllProductList(this.queryObject);
      }
    });
  }
  deleteStock(data){

  }
  viewStock(data){
    this.router.navigate(['crm/shiping-management/ready-stock/view/',data.id]);
  }
  ngOnDestroy(): void {
    this._localStorage.setPage = { productManagement: JSON.stringify(this.queryObject) };
    
  }

}
