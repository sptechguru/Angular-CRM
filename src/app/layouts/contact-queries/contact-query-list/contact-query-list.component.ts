import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
@Component({
  selector: 'app-contact-query-list',
  templateUrl: './contact-query-list.component.html',
  styleUrls: ['./contact-query-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class ContactQueryListComponent implements OnInit {

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
  offset: any;


  constructor(
    private route: ActivatedRoute,
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
      search_text: ''
    }
    this.getAllContactQueryList(this.queryObject);
  }


  getAllContactQueryList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.CONTACT_QUERY_LIST;
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      // console.log(pageObj);
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
          // console.log(this.totalQueryableData);
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

  deleteContactQuery(id: string, ContactQuery: string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete \'' + ContactQuery + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.CONTACT_QUERY_DELETE + '/' + id;
        this.isListLoading = false;
        this.apiHandlerService.apiPost(url, null).subscribe(
          (result: any) => {
            if (result.success === true) {
              this.toasterService.Success(result.message);
              this.getAllContactQueryList({ page: this.currentPage, search_text: '' });
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

  searchContactQueryByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllContactQueryList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllContactQueryList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllContactQueryList(this.queryObject);
  };

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      // console.log(this.queryObject);
      // console.log(this.queryObject.page);
      this.getAllContactQueryList(this.queryObject);
    }
  };


}
