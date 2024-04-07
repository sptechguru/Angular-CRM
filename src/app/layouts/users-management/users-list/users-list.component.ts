import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { TimeoutError } from "rxjs";
import { API } from "app/shared/constants/endpoints";
//import { MatDialogRef,MatDialog,MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmationDialogHandlerService } from "app/shared/components/confirmation-dialog/confirmation-dialog-handler.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { StorageAccessorService } from "app/shared/services/localstorage-accessor.service";
import { UrlService } from "app/shared/services/url.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { AssignToUserComponent } from "./assign-to-user/assign-to-user.component";
import { animate, keyframes, query, stagger, style, transition, trigger } from "@angular/animations";
import { MatSelectChange } from "@angular/material/select";
import { data } from "jquery";
import { Location } from '@angular/common';

export interface DialogData {
  name: string;
}

@Component({
  selector: "app-users-list",
  templateUrl: "./users-list.component.html",
  styleUrls: ["./users-list.component.css"],
  providers: [ConfirmationDialogHandlerService],
  animations: [
    trigger('flyInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms')
      ]),
      transition('* => void', [
        animate('300ms', style({ transform: 'translateX(100%)' }))
      ]),
    ]),]
})
export class UsersListComponent implements OnInit {
  dataList: Array<any> = [];
  new_status: string;
  loading: boolean;
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
  name: string;
  offset: any;
  kyc_Done = 50;
  pendingKyc: number;
  rejectKyc: number;


  resellerToAssign: Array<any> = [];

  minimize: boolean = true;


  kyc_updates: any[] = [
    { title: 'All Customer', value: 'reject' },
    { title: 'KYC Completed', value: 'approve' },
    { title: 'KYC Incompleted', value: 'pending' }
  ];

  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    private urlService: UrlService,
    public _localStorage: StorageAccessorService,
    private location:Location,
    // private dialog: MatDialog,
    public dialog: MatDialog,
    private ConfirmationDialogHandlerService: ConfirmationDialogHandlerService
  ) {
    this.sortByStatusObject = [
      {
        key: "active",
        value: "Active",
      },
      {
        key: "inactive",
        value: "Inactive",
      },
    ];
    this.sortByUserTypeObject = [
      {
        key: "service_provider",
        value: "Service Provider",
      },
      {
        key: "customer",
        value: "Customer",
      },
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

        if (previousUrl && previousUrl.split("/")[2] === "users-management") {
          this.queryObject = JSON.parse(
            this._localStorage.getPage.userManagement
          );
        }
        this.getAllUserList(this.queryObject);
      })
      .unsubscribe();

    this.getState();
    this.getTotalData(1);
    this.getTotalDataOfKycPending(1);
    this.getTotalDataOfKycReject(1);

  }

  UpdateTr(value, id, name, updateId, userGroup, userId) {
    let categoryName;
    if (userGroup === 'A') {
      categoryName = 'RESELLER'
    }
    else if (userGroup === 'B') {
      categoryName = 'DIRECT'

    }
    if (value) {
      this.router.navigate(['/crm/kyc-list/kyc-details', { id: id, name: name, update: updateId, user_group: categoryName, userid: userId }])
    }
  }

  state: Array<any> = []
  getState() {
    this.apiHandlerService.apiGet(API.STATE_API).subscribe({
      next: next => {

        this.state = next.data.rows.reverse()


      },
      error: error => { }
    })
  }
  title: Array<any> = []
  // getTitle() {
  //   this.apiHandlerService.apiGet(API.ADMIN_USER_ENDPOINTS.UPDATE_RESELLER_EMAIL_VERIFY).subscribe({
  //     next: next => {

  //       this.title = next.data.rows.reverse()
  //     },
  //     error: error => { }
  //   })
  // }
  onselectionChange($event: MatSelectChange) {
    // console.log($event);
    this.queryObject.state_id = $event.value;
    this.queryObject.page = 1;
    this.queryObject.resellerpage = 1;
    // data.resellerpage
    // this.queryObject.page = 1;
    // console.log(this.queryObject);
    this.getAllUserList({ ...this.queryObject, limit: $event.value ? 1000 : 10 });
  }
  onselectionsKyc($event: MatSelectChange) {
    this.queryObject.gst_status = $event.value;
    this.queryObject.page = 1;
    this.queryObject.resellerpage = 1;
    this.getAllUserList({ ...this.queryObject, limit: $event.value ? 10 : 10 });
  }


  // onselectionsChange($event: MatSelectChange) {
  //   // console.log($event);
  //   this.queryObject.state_id = $event.value;
  //   console.log("OOOOOOOOOOOOOOOOOOOOOOOOO",this.queryObject);
  //   this.queryObject.page = 1;
  //   this.queryObject.resellerpage = 1;
  //   // data.resellerpage
  //   // this.queryObject.page = 1;
  //   // console.log(this.queryObject);

  //   this.getAllUserList({ ...this.queryObject, limit: $event.value ? 1000 : 10 });

  // }
  getAllUserList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.RESELLER_LIST;
      const limit = data.limit || this.pageSize || 10;
      let pageObj: any = {
        search_text: data.search_text,
        page: data.page,
      };
      if (data.gst_status) {
        pageObj["gst_status"] = data.gst_status;

      }

      if (data?.state_id) pageObj.state_id = data?.state_id;
      pageObj["limit"] = limit;
      pageObj["offset"] = (data.page - 1) * limit;
      this.offset = (data.page - 1) * limit;
      if (data.sortFied && data.orderBy) {
        pageObj["sort_field"] = data.sortFied;
        pageObj["order_by"] = data.orderBy;
      }
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows) {
            this.dataList = resultData.rows;
            for(let i=0; i< this.dataList.length;i++){
              this.dataList[i]?.reseller_kyc?.gst_status

            }

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
          if (this.queryObject.state_id) {
            this.dataList = this.dataList.slice((data.resellerpage - 1) * 10,
              (data.resellerpage - 1) * 10 + 10)

            this.page = data.resellerpage
          }
          this.isListLoading = false;
        },
        error: (err) => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error("", "Timeout Error");
          }
          this.isListLoading = false;
        },
        complete: () => {
          this.isListLoading = false;
          this.isStatusBtnEnabled = true;
        },
      });
    }
  }

  getTotalData($event) {
    if ($event.start_date && $event.end_date) {
      var obj = {
        start_date: $event.start_date,
        end_date: $event.end_date,
        gst_status: 'approve'
      }
    } else {
      var objs = {
        start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
        end_date: new Date(),
        gst_status: 'approve'
      }
      obj = objs
    }
    const url = API.CRM_ENDPOINTS.RESELLER_KYC_COUNT;

    this.apiHandlerService.apiGet(url, obj).subscribe({
      next: (result: any) => {
        this.kyc_Done = result.data
      },
      error: (err) => {

      },
      complete: () => {
      },
    });
  }

  getTotalDataOfKycPending($event) {
    if ($event.start_date && $event.end_date) {
      var obj = {
        start_date: $event.start_date,
        end_date: $event.end_date,
        gst_status: 'pending'
      }
    } else {
      var objs = {
        start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
        end_date: new Date(),
        gst_status: 'pending'
      }
      obj = objs
    }

    const url = API.CRM_ENDPOINTS.RESELLER_KYC_COUNT;

    this.apiHandlerService.apiGet(url, obj).subscribe({
      next: (result: any) => {
        this.pendingKyc = result.data
      },
      error: (err) => {

      },
      complete: () => {
      },
    });
  }
  getTotalDataOfKycReject($event) {
    if ($event.start_date && $event.end_date) {
      var obj = {
        start_date: $event.start_date,
        end_date: $event.end_date,
        gst_status: 'reject'
      }
    } else {
      var objs = {
        start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
        end_date: new Date(),
        gst_status: 'reject'
      }
      obj = objs
    }
    const url = API.CRM_ENDPOINTS.RESELLER_KYC_COUNT;

    this.apiHandlerService.apiGet(url, obj).subscribe({
      next: (result: any) => {
        this.rejectKyc = result.data
      },
      error: (err) => {

      },
      complete: () => {
      },
    });
  }


  deleteUser(id) { }
  onChange(checked, reseller) {
    // console.log(checked , product);

    if (checked) {
      this.resellerToAssign.push(reseller);
      return;
    } else {
      this.resellerToAssign = this.resellerToAssign.filter(x => x.id !== reseller.id);
      return;
    }
  }

  getElemment(id) {
    return this.resellerToAssign.findIndex(x => id === x.id) === -1 ? false : true;
  }

  searchUserByQuery(query = "") {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;

    this.getAllUserList(this.queryObject);
  }

  sortUserByStatus(status = "") {
    this.queryObject.page = 1;
    this.queryObject.query["status"] = status;
    this.getAllUserList(this.queryObject);
  }

  sortUserByType(user_type = "") {
    this.queryObject.page = 1;
    this.queryObject.query["user_type"] = user_type;
    this.getAllUserList(this.queryObject);
  }

  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = this.queryObject.state_id ? 1 : newPage;
      this.queryObject.resellerpage = newPage;
      this.getAllUserList({ ...this.queryObject, limit: this.queryObject.state_id ? 1000 : 10 });
    }
  }
  assignInBulk() {
    const ids = this.resellerToAssign.map(x => x.fk_user_id)
    console.log(ids);
    console.log(this.resellerToAssign);

    this.assignToCrmUser(ids)

  }

  assignToCrmUser(id) {
    const dialogRef = this.dialog.open(AssignToUserComponent, {
      width: "250px",
      data: id,
    });

    dialogRef.afterClosed().subscribe(
      next => {
        this.resellerToAssign = [];
      }
    )
  }



  businessNameUpdate(id, name) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "250px",
      data: { id: id, name: name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.queryObject.page) {
        this.queryObject.page = this.queryObject.page;
      } else {
        this.queryObject.page = 1;
      }
      this.queryObject = {
        page: this.queryObject.page,
        search_text: "",
      };
      this.getAllUserList(this.queryObject);
    });
  }

  statusUpdate(e, id, name) {
    this.ConfirmationDialogHandlerService.openDialog({
      question: "Are sure you want to update status of '" + name + "?",
      confirmText: "Yes",
      cancelText: "No",
    }).subscribe((result) => {
      if (result) {
        if (e == "active") {
          this.status = "inactive";
        } else if (e == "inactive") {
          this.status = "active";
        }
        if (this.status) {
          const url =
            API.ADMIN_USER_ENDPOINTS.UPDATE_RESELLER_STATUS +
            "/" +
            id +
            "/" +
            this.status;
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
                this.getAllUserList(this.queryObject);
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
        } else {
          this.toasterService.Error("Reseller status is pending");
        }
      }
    });
  }

  emailVerify(e, id, name) {
    if (e === "pending") {
      this.ConfirmationDialogHandlerService.openDialog({
        question: "Are sure you want to verify email '" + name + "?",
        confirmText: "Yes",
        cancelText: "No",
      }).subscribe((result) => {
        if (result) {
          const url =
            API.ADMIN_USER_ENDPOINTS.UPDATE_RESELLER_EMAIL_VERIFY + "/" + id;
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
                this.getAllUserList(this.queryObject);
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
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._localStorage.setPage = {
      userManagement: JSON.stringify(this.queryObject),
    };

    //  this.routerSub.unsubscribe();
  }
}

@Component({
  selector: "dialog-overview-example",
  templateUrl: "dialog.html",
})
export class DialogOverviewExampleDialog implements OnInit {
  name: any;
  id: any;
  isUserProcessing: boolean = false;
  addEditForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public fb: FormBuilder,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService
  ) {
    this.name = data.name;
    this.id = data["id"];
    this.createForm();
  }

  ngOnInit() {
    // console.log(this.name);
    // console.log(this.id);
    this.addEditForm.get("name").setValue(this.name);
  }

  createForm() {
    this.addEditForm = this.fb.group({
      name: ["", [Validators.required]],
    });
  }

  onSubmit() {
    let names = this.addEditForm.value.name;
    let url =
      API.CRM_ENDPOINTS.UPDATE_BUSINESS_NAME + "/" + this.id + "/" + names;
    this.isUserProcessing = true;
    this.apiHandlerService
      .apiPost(url, {}, { contentType: { isFormDataContent: false } })
      .subscribe({
        next: (data) => {
          if (data.success) {
            this.toasterService.Success(data.message);
            this.dialogRef.close();
          } else {
            this.toasterService.Error(data.message);
          }
          this.isUserProcessing = false;
        },
        error: (err) => {
          this.toasterService.Error(err.message);
        },
        complete: () => { },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
