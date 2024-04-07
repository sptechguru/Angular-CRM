import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { UrlService } from 'app/shared/services/url.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-requset-call-back',
  templateUrl: './requset-call-back.component.html',
  styleUrls: ['./requset-call-back.component.css']
})
export class RequsetCallBackComponent implements OnInit {

  dataList: Array<any> = [];
  saving = false;
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
  type;
  ngOnInit() {
    this.type = this.router.url.split('/')[this.router.url.split('/').length - 1]
    this.queryObject = {
      page: 1,
      search_text: "",
      type: this.type
    };


    this.getAllRequestCall(this.queryObject);



  }
  onTabChanged($event: MatTabChangeEvent) {
    console.log($event);
    this.queryObject = {
      page: 1,
      search_text: "",
      type: this.type
    };

    this.getAllRequestCall(this.queryObject);

  }


  getAllRequestCall(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.GET_REQUEST_RECALL_BACK;
      const limit = this.pageSize || 10;
      let pageObj = {

        ...data
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
            // console.log( this.dataList);

            this.dataList = this.dataList.concat();
          } else {
            this.dataList = [];
          }
          this.totalQueryableData = resultData.total;
          if (data.page) {
            this.page = data.page;
          } else {
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
    this.getAllRequestCall(this.queryObject);
  };

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      this.getAllRequestCall(this.queryObject);
    }
  };


  ngOnDestroy(): void {
    this._localStorage.setPage = { ReqestReCallManagement: JSON.stringify(this.queryObject) };
    //  this.routerSub.unsubscribe();
  }








}
