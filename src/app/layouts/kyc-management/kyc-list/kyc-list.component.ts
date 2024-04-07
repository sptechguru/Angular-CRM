import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-kyc-list',
  templateUrl: './kyc-list.component.html',
  styleUrls: ['./kyc-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class KycListComponent implements OnInit {

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
      search_text: '',
    }
    this.getAllKycList(this.queryObject);
  }

  getAllKycList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.GET_KYC_LIST;
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


  updateUserStatus(id: string, status: string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to change the status to \'' + status + '\'',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.ADMIN_USER_ENDPOINTS.USER_STATUS_UPDATE_URL
        const indexToBeChanged = this.dataList.findIndex(
          entity => entity._id === id
        );
        if (this.dataList[indexToBeChanged].status !== status) {
          this.isListLoading = false;
          this.isStatusBtnEnabled = false;
          this.apiHandlerService.apiPost(url(status, id), null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                if (status == 'deleted') {
                  this.dataList.splice(indexToBeChanged, 1);
                } else {
                  this.dataList[indexToBeChanged].status = status;
                }
                this.dataList = this.dataList.concat();
              } else {
                this.isListLoading = false;

                this.toasterService.Error();
              }
              this.isListLoading = false;
              this.isStatusBtnEnabled = true;
            },
            err => {
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
                this.isListLoading = false;
              }
              this.isStatusBtnEnabled = true;
            }
          );
        }
      }
    });
  }

  deleteUser(id) {
  };

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllKycList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllKycList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllKycList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllKycList(this.queryObject);
    }
  };
}
