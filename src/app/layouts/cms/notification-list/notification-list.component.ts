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
import { CreateNotificationComponent } from '../create-notification/create-notification.component';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class NotificationListComponent implements OnInit {
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
    public dialog: MatDialog,
    private _dialog: ConfirmationDialogHandlerService,
    private _localStorage: StorageAccessorService,
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



    this.urlService.previousUrl$
      .subscribe((previousUrl: string) => {
        if (!previousUrl) this.page = 1;
        this.queryObject = {
          page: 1,
          search_text: "",
        };


        if (previousUrl && previousUrl.split("/")[3] === "Notification-management") {


          this.queryObject = JSON.parse(this._localStorage.getPage.NotificationManagement);

        }
        this.getAllNotificationList(this.queryObject);
      })
      .unsubscribe();
  }



  getAllNotificationList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.NOTIFICATION_LIST;
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
    this.getAllNotificationList(this.queryObject);
  };

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      this.getAllNotificationList(this.queryObject);
    }
  };

  openDialog() {
    const dialog = this.dialog.open(CreateNotificationComponent).afterClosed().subscribe(response => {
      if (response) {
        this.getAllNotificationList(this.queryObject);
      }
    });

  }
  ngOnDestroy(): void {
    this._localStorage.setPage = { NotificationManagement: JSON.stringify(this.queryObject) };
    //  this.routerSub.unsubscribe();
  }

  sendNotification(data) {
    if (!data) return;
    this.saving = true;
    const endpoint = API.CRM_ENDPOINTS.NOTIFICATION_SEND;
    this.apiHandlerService.apiPost(endpoint, data).subscribe({
      next: next => {
        if (!next.success) return;
        this.toasterService.Success(next.message)
        this.saving = false;
      },
      error: err => {
        // console.log(err)
        this.saving = false;

      },
      complete: () => {

      }
    })


  }

  deleteNotification(notification) {
    this._dialog.openDialog({ title: 'Delete Notification', cancelText: 'Cancel', confirmText: 'Delete', question: 'Are sure you want to delete notification?' }).subscribe(response => {
      if (!response) return;
      this.apiHandlerService.apiGet(API.CRM_ENDPOINTS.DELETE_NOTIFICATION(notification.id)).subscribe({
        next: next => {
          this.toasterService.Success(next.message)

        },
        error: err => {

        }
      })
    })
  }


}
