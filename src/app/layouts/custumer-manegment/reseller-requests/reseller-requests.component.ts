import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateCatelogComponent } from 'app/layouts/catelog-manegment/create-catelog/create-catelog.component';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-reseller-requests',
  templateUrl: './reseller-requests.component.html',
  styleUrls: ['./reseller-requests.component.css']
})
export class ResellerRequestsComponent implements OnInit {

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
  currentPage: any;
  offset: any;

  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService
  ) {

  }

  ngOnInit() {
    this.queryObject = {
      page: 1,
      search_text: '',
    }
    this.getAllCrmUserList(this.queryObject);
  }



  getAllCrmUserList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.RESLLER_REQUEST;
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
          if (resultData.rows) {
            // this.dataList = resultData.rows;
            // console.log( this.dataList);

            this.dataList = [];
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
  };

  delete(id){
    const api = API.CRM_ENDPOINTS.DELETE_CATELOG(id);
    
  }

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllCrmUserList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllCrmUserList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllCrmUserList(this.queryObject);
  };

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      this.getAllCrmUserList(this.queryObject);
    }
  };




}
