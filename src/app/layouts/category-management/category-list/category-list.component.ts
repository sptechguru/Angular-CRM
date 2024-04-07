import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { UrlService } from 'app/shared/services/url.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class CategoryListComponent implements OnInit {

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
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    private urlService: UrlService,
    private _localStorage: StorageAccessorService,

    public toasterService: ToasterService,
    private confirmationDialogHandlerService: ConfirmationDialogHandlerService
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
          page: this.page,
          search_text: "",
          transaction_number: ""
        };
        // // console.log('previous url: ', previousUrl.split("/")[2]);
        if (previousUrl && previousUrl.split("/")[2] === "category-management") {
          // // console.log(this._localStorage.getPage);
          this.queryObject = JSON.parse(this._localStorage.getPage.categoryManagement);

        }

        this.getAllCategoryList(this.queryObject);
      })
      .unsubscribe();


  }


  getAllCategoryList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.CATEGORY_LIST;
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit || 0;
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
            console.log(this.dataList);
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

  saveToLocal(category) {
    localStorage.setItem('categoryData', JSON.stringify(category));
  }

  deleteCategory(id: string, categoryName: string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete \'' + categoryName + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.CATEGORY_DELETE + '/' + id;
        const indexToBeChanged = this.dataList.findIndex(
          entity => entity._id === id
        );
        this.isListLoading = false;
        this.apiHandlerService.apiPost(url, null).subscribe(
          (result: any) => {
            if (result.success === true) {
              this.toasterService.Success(result.message);
              this.getAllCategoryList({ page: this.currentPage, search_text: '' });
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

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllCategoryList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllCategoryList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllCategoryList(this.queryObject);
  };

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      this.getAllCategoryList(this.queryObject);
    }
  };

  ngOnDestroy(): void {
    this._localStorage.setPage = { categoryManagement: JSON.stringify(this.queryObject) };
    //  this.routerSub.unsubscribe();
  }

}
