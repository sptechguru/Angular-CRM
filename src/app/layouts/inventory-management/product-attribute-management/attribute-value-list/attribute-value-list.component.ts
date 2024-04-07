import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-attribute-value-list',
  templateUrl: './attribute-value-list.component.html',
  styleUrls: ['./attribute-value-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class AttributeValueListComponent implements OnInit {

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
  currentPage = 1;
  typeDetails;
  productId;
  variantId;
  offset: any;

  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    private _location: Location,
    public activeRoute: ActivatedRoute
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
    this.queryObject = {
      page: 1,
      search_text: ''
    }
    this.typeDetails = JSON.parse(localStorage.getItem('setAttributeData'));
    this.activeRoute.params.subscribe(params => {
      if(params['pid']){
        this.productId = params['pid'];
      }else{
        this.productId = '';
      }
      if(params['vid']){
        this.variantId = params['vid'];
      }else{
        this.variantId = '';
      }
    });
    this.getAllAttributeValueList(this.queryObject);
  }


  saveToLocal(productAttribute){
    localStorage.setItem('productAttributeData',JSON.stringify(productAttribute));
  }


  deleteProductAttribute(id: string,productAttributeName:string) {
     this.confirmationDialogHandlerService.openDialog({
       question: 'Are sure you want to delete \'' + productAttributeName + '?',
       confirmText: 'Yes',
       cancelText: 'No'
     }).subscribe((result) => {
       if (result) {
         let url = API.CRM_ENDPOINTS.PRODUCTATTRIBUTE_DELETE + '/' + id;
          const indexToBeChanged = this.dataList.findIndex(
           entity => entity._id === id
          );
           this.isListLoading = false;
           this.apiHandlerService.apiPost(url, null).subscribe(
             (result: any) => {
               if (result.success === true) {
                 this.toasterService.Success(result.message);
                 this.getAllAttributeValueList({page: this.currentPage,search_text: ''});
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
  
  getAllAttributeValueList(data) {
    if(!this.isListLoading) {
      this.isListLoading = true;
      let url;
      this.typeDetails.type == 'Product' ?
      url = API.CRM_ENDPOINTS.ADDATTRIBUTEVALUE_PRODUCT + '/' + JSON.parse(this.typeDetails.id) 
      : 
      url = API.CRM_ENDPOINTS.ADDATTRIBUTEVALUE_VARIANT + '/' + JSON.parse(this.typeDetails.id);
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

  addValue(){
    localStorage.setItem("attributeValueList", JSON.stringify(this.dataList));
    if(localStorage.getItem('productAttributeData')){
      localStorage.removeItem('productAttributeData')
    }  
  }

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllAttributeValueList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllAttributeValueList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllAttributeValueList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllAttributeValueList(this.queryObject);
    }  
  };

}
