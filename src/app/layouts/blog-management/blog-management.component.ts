import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-blog-management',
  templateUrl: './blog-management.component.html',
  styleUrls: ['./blog-management.component.css'],
  providers: [ConfirmationDialogHandlerService],
})
export class BlogManagementComponent implements OnInit {


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
    this.blogList(this.queryObject);
  }

  blogList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.BLOG_LIST;
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




  deleteBlog(id) {
    this.confirmationDialogHandlerService.openDialog({
      question: "Are sure you want to delete blog?",
      confirmText: "Yes",
      cancelText: "No",
    }).subscribe((result) => {
      if (!result) return

      const url =
        API.CRM_ENDPOINTS.DELETE_BLOG(id)

      this.apiHandlerService.apiPost(url, {}, {}).subscribe({
        next: (data) => {
          if (data.success) {
            if (this.queryObject.page) {
              this.queryObject = {
                page: this.queryObject.page,
                search_text: "",
              };
            } else {
              this.queryObject = {
                page: 1,
                search_text: "",
              };
            }
            this.blogList(this.queryObject);
            this.toasterService.Success(data.message);
          } else {
            if (data.error && data.error.message) {
              this.toasterService.Error(data.error.message);
            } else if (data.error && data.error.length > 0) {
              data.error.forEach((erroObj) => {
                this.toasterService.Error(erroObj.msg);
              });
            } else {
              this.toasterService.Error("Something went wrong.");
            }
          }
        },
        error: (err) => {
          if (typeof err == "string") {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        },
        complete: () => { },
      });


    });
  }

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.blogList(this.queryObject);
  };

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.blogList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.blogList(this.queryObject);
  };

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      this.blogList(this.queryObject);
    }
  };


}
