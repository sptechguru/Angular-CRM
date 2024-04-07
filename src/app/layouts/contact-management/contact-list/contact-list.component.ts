import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class ContactListComponent implements OnInit {

 
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
      query: {
        offset: '0',
        limit: '10',
        search_text: ''
      }
    }
    this.getAllUserList(this.queryObject);
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

  getAllUserList(data) {
    this.isListLoading = true;
    
    const limit = this.pageSize || 10;
    let pageObj : any= {};
    if (typeof data.query === 'object') {
      pageObj = Object.assign({}, data.query);
    } else {
      pageObj = {
        query: data.query,
      };
    }
    pageObj['limit'] = limit;
    pageObj['offset'] = (data.page - 1) * limit;
    if (data.sortFied && data.orderBy) {
      pageObj['sort_field'] = data.sortFied;
      pageObj['order_by'] = data.orderBy;
    }
  
    const url = API.CRM_ENDPOINTS.CONTACT_LIST ;

    this.apiHandlerService.apiGet(url,pageObj).subscribe({
      next: (result: any) => {


        let resultData = result.data;
        if (resultData.rows) {
          this.dataList = resultData.rows;
          this.dataList = this.dataList.concat();
        } else {
          this.dataList = [];
        }
        this.totalQueryableData = resultData.total;
        this.page = resultData.page;
      },

      error: err => {
        if (err instanceof TimeoutError) {
          
          this.toasterService.Error('', 'Timeout Error');
        }
      },

      complete: () => {
        this.isListLoading = false;
        this.isStatusBtnEnabled = true;
      }
    });
  }

  deleteUser(id) {
  
  };

  searchUserByQuery(query = '') {
    this.queryObject.query['query'] = query;
    this.queryObject.page = 1;
    this.getAllUserList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllUserList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllUserList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllUserList(this.queryObject);
    }
  };

}
