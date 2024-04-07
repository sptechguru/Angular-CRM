import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from "@angular/router";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { Subscribable, Subscriber, TimeoutError } from "rxjs";
import { API } from "app/shared/constants/endpoints";
import { ConfirmationDialogHandlerService } from "app/shared/components/confirmation-dialog/confirmation-dialog-handler.service";
import { filter, pairwise } from "rxjs/operators";
import { StorageAccessorService } from "app/shared/services/localstorage-accessor.service";
import { UrlService } from "app/shared/services/url.service";
import { MatDialog } from "@angular/material/dialog";
import { CancelOrderModelComponent } from "../cancel-order-model/cancel-order-model.component";
import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from "@angular/animations";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
  animations: [
    trigger("flyInOut", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        animate("300ms"),
      ]),
      transition("* => void", [
        animate("300ms", style({ transform: "translateX(100%)" })),
      ]),
    ]),
    trigger("listAnimation", [
      transition("* => *", [
        query(":enter", style({ opacity: 0 }), { optional: true }),

        query(
          ":enter",
          stagger("300ms", [
            animate(
              "500ms ease-in",
              keyframes([
                style({ opacity: 0, transform: "translateY(-75%)", offset: 0 }),
                style({
                  opacity: 0.5,
                  transform: "translateY(35px)",
                  offset: 0.3,
                }),
                style({ opacity: 1, transform: "translateY(0)", offset: 1.0 }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
  providers: [ConfirmationDialogHandlerService],
})
export class OrderListComponent implements OnInit {
  showOrderDetails: boolean = false;
  orderDetailId: string = "";
  private previousUrl: string = undefined;

  dataList: Array<any> = [];
  new_status: string;
  loading: boolean;
  sortByPaymentStatusObject: any = [];
  sortDeliveryByTypeObject: any = [];
  sortOrderByStatusObject: any = [];
  sortIsItemBrandingObject: any = [];
  sortDeliveryByStatusObject: any = [];
  orderCount: number;
  revenue: number;
  queryObject: any;
  userService: any;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number = 1;
  removable = true;
  selectable = true;
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  offset: any;
  totalorder: any;
  pendingorder: any;
  completeorder: any;
  canceledorder: any;
  createorder: any;
  processingorder: any;
  routerSub;
  constructor(
    private router: Router,
    private urlService: UrlService,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
    private _localStorage: StorageAccessorService,
    public ConfirmationDialogHandlerService: ConfirmationDialogHandlerService
  ) {
    this.sortByPaymentStatusObject = [
      {
        key: "None",
        value: "",
      },
      {
        key: "Pending",
        value: "pending",
      },
      {
        key: "Partial Paid",
        value: "partial_paid",
      },
      {
        key: "Paid",
        value: "paid",
      },
      {
        key: "Failed",
        value: "failed",
      },
      {
        key: "Refund",
        value: "refund",
      },
    ];
    this.sortDeliveryByTypeObject = [
      {
        key: "None",
        value: "",
      },
      {
        value: "logistic_delevery",
        key: "Logistic Delevery",
      },
      {
        value: "self_pickup",
        key: "Self Pickup",
      },
    ];
    this.sortIsItemBrandingObject = [
      {
        key: "None",
        value: "",
      },
      {
        value: "yes",
        key: "Yes",
      },
      {
        value: "no",
        key: "No",
      },
    ];
    this.sortOrderByStatusObject = [
      {
        key: "None",
        value: "",
      },
      {
        key: "Branding Pending",
        value: "branding_pending",
      },
      {
        key: "Pending Verification",
        value: "pending_verification",
      },
      {
        key: "Created",
        value: "created",
      },
      {
        key: "Processing",
        value: "processing",
      },
      {
        key: "Complete",
        value: "complete",
      },
      {
        key: "Cancelled",
        value: "cancelled",
      },
    ];
  }


  get getFilterArray() {
    let filter = [];
    for (const key in this.queryObject) {
      if (Object.prototype.hasOwnProperty.call(this.queryObject, key)) {
        if (key === "payment_status" && this.queryObject[key] !== "") {
          filter.push(
            this.sortByPaymentStatusObject.find(
              (x) => x.value === this.queryObject[key]
            )
          );
        }
        if (key === "order_status" && this.queryObject[key] !== "") {
          filter.push(
            this.sortOrderByStatusObject.find(
              (x) => x.value === this.queryObject[key]
            )
          );
        }
        if (key === "is_item_branding" && this.queryObject[key] !== "") {
          filter.push(
            this.sortIsItemBrandingObject.find(
              (x) => x.value === this.queryObject[key]
            )
          );
        }
        if (key === "delivery_type" && this.queryObject[key] !== "") {
          filter.push(
            this.sortDeliveryByTypeObject.find(
              (x) => x.value === this.queryObject[key]
            )
          );
        }
      }
    }
    return filter;
  }

  removeFilter(value) {
    for (const key in this.queryObject) {
      if (Object.prototype.hasOwnProperty.call(this.queryObject, key)) {
        if (this.queryObject[key] === value) {
          this.queryObject[key] = "";
          this.getAllOrderList(this.queryObject);
        }
      }
    }
  }

  cancelOrder(data) {
    const dialogRef = this.dialog.open(CancelOrderModelComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.response) {
        //  // console.log(result);
        this.cancel(
          result.cancel_reason,
          result.order_id,
          result.tracking_number
        );
      }
    });
  }

  cancel(cancel_reason, order_id, tracking_number) {
    this.ConfirmationDialogHandlerService.openDialog({
      question:
        "Are sure you want to cancel Order of id '" + tracking_number + "?",
      confirmText: "Yes",
      cancelText: "No",
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.MANUAL_CANCEL_ORDER;

        let payload = {
          order_id: order_id,
          cancel_reason: cancel_reason,
        };
        this.apiHandlerService.apiPost(url, payload).subscribe(
          (result: any) => {
            // console.log(result)
            if (result.success === true) {
              this.toasterService.Success(result.message);
              this.getAllOrderList(this.queryObject);
            } else {
              this.toasterService.Error();
            }
          },
          (err) => {
            if (err instanceof TimeoutError) {
              this.toasterService.Error("", "Timeout Error");
            }
          }
        );
      }
    });
  }

  ngOnInit() {
    this.urlService.previousUrl$
      .subscribe((previousUrl: string) => {
        if (!previousUrl) this.page = 1;
        this.queryObject = {
          page: this.page,
          search_text: "",
          transaction_number: "",
        };
        // // console.log('previous url: ', previousUrl.split("/")[2]);
        if (previousUrl && previousUrl.split("/")[2] === "order-management") {
          // // console.log(this._localStorage.getPage);
          this.queryObject = JSON.parse(
            this._localStorage.getPage.orderManagement
          );
        }

        this.getSelesCalenderWise({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getRevenueCalenderWise({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getTotalOrders({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getPendingOrders({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getCancelOrders({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getCreateOrders({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getProcessingOrders({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getCompleteOrders({
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
          end_date: new Date(),
        });

        this.getAllOrderList(this.queryObject);
      })
      .unsubscribe();
    // this.getOrderscountList();

    // if(this.dataList.length) return
    //  this.queryObject = {
    //       page: 1,
    //       search_text: "",
    //     };
    //     // console.log(this.queryObject);

    //     this.getAllOrderList(this.queryObject);
  }

  getOrderscountList() {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService.apiGet(url).subscribe(
      (res) => {
        this.totalorder = res.data;
        // console.log(this.totalorder);
      },
      (error) => {
        // console.log(error);
        this.toasterService.Error(error);
      }
    );
  }

  getTotalOrders(data) {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService.apiGet(url + "/all", data).subscribe(
      (res) => {
        this.totalorder = res.data;
        // console.log(res.data);
      },
      (error) => {
        // console.log(error);
        this.toasterService.Error(error);
      }
    );
  }

  getPendingOrders(data) {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService
      .apiGet(url + "/pending_verification", data)
      .subscribe(
        (res) => {
          this.pendingorder = res.data;
          // console.log(res.data);
        },
        (error) => {
          // console.log(error);
          this.toasterService.Error(error);
        }
      );
  }

  getCreateOrders(data) {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService.apiGet(url + "/created", data).subscribe(
      (res) => {
        this.createorder = res.data;
        // console.log(res.data);
      },
      (error) => {
        // console.log(error);
        this.toasterService.Error(error);
      }
    );
  }

  getCancelOrders(data) {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService.apiGet(url + "/cancelled", data).subscribe(
      (res) => {
        this.canceledorder = res.data;
        // console.log(res.data);
      },
      (error) => {
        // console.log(error);
        this.toasterService.Error(error);
      }
    );
  }

  getProcessingOrders(data) {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService.apiGet(url + "/processing", data).subscribe(
      (res) => {
        this.processingorder = res.data;
        // console.log(res.data);
      },
      (error) => {
        // console.log(error);
        this.toasterService.Error(error);
      }
    );
  }

  getCompleteOrders(data) {
    const url = API.CRM_ENDPOINTS.COUNT_TOTAL_ORDERS;
    this.apiHandlerService.apiGet(url + "/complete", data).subscribe(
      (res) => {
        this.completeorder = res.data;
        // console.log(res.data);
      },
      (error) => {
        // console.log(error);
        this.toasterService.Error(error);
      }
    );
  }

  get date() {
    if (this.queryObject.start_date && this.queryObject.end_date) {
      return {
        start: new Date(this.queryObject.start_date),
        end: new Date(this.queryObject.end_date),
      };
    } else
      return {
        start: null,
        end: null,
      };
  }

  getSelesCalenderWise(data) {
    const url = API.CRM_ENDPOINTS.SALE_CALENDER_WISE;
    this.apiHandlerService.apiGet(url, data).subscribe({
      next: (next) => {
        // // console.log(next);
        this.orderCount = next.data;
      },
      error: (err) => { },
      complete: () => { },
    });
  }

  getRevenueCalenderWise(data) {
    const url = API.CRM_ENDPOINTS.GET_ORDER_REVENUE;
    this.apiHandlerService.apiGet(url, data).subscribe({
      next: (next) => {
        // // console.log(next);
        this.revenue = next.data.totalRevenue.toFixed(2);
      },
      error: (err) => { },
      complete: () => { },
    });
  }

  updateUserStatus(id: string, status: string) {
    this.ConfirmationDialogHandlerService.openDialog({
      question: "Are sure you want to change the status to '" + status + "'",
      confirmText: "Yes",
      cancelText: "No",
    }).subscribe((result) => {
      // // console.log("result : ", result);
      if (result) {
        let url = API.ADMIN_USER_ENDPOINTS.USER_STATUS_UPDATE_URL;
        const indexToBeChanged = this.dataList.findIndex(
          (entity) => entity._id === id
        );
        if (this.dataList[indexToBeChanged].status !== status) {
          this.isListLoading = false;
          this.isStatusBtnEnabled = false;
          this.apiHandlerService.apiPost(url(status, id), null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                if (status == "deleted") {
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
            (err) => {
              if (err instanceof TimeoutError) {
                this.toasterService.Error("", "Timeout Error");
              }
              this.isListLoading = false;
              this.isStatusBtnEnabled = true;
            }
          );
        }
      }
    });
  }
  ngAfterContentChecked() {
    this.ref.detectChanges();
  }
  getAllOrderList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.ORDER_LIST;
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text,
        ...data,
      };
      pageObj["limit"] = limit;
      pageObj["offset"] = (data.page - 1) * limit;
      if (data.sortFied && data.orderBy) {
        pageObj["sort_field"] = data.sortFied;
        pageObj["order_by"] = data.orderBy;
      }
      // // console.log(data);

      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            // // console.log(this.dataList);

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

  deleteUser(id) { }

  addComment(comment, orderID) {
    //  // console.log(comment);

    if (comment.length === 0 || comment === null || comment === undefined)
      return;
    const data = {
      user_id: this._localStorage.fetchUserDetailsByKey("id"),
      order_id: orderID,
      comments: comment,
    };
    // // console.log(data);

    const url = API.CRM_ENDPOINTS.ADD_COMMENT;

    this.apiHandlerService.apiPost(url, data).subscribe({
      next: (next) => {
        // // console.log(next);
        this.toasterService.Success("", next.message);
        comment = "";
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
      complete: () => { },
    });
  }

  searchUserByQuery(query = "") {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllOrderList(this.queryObject);
  }

  filterByDate(date) {
    const intervalObj = setInterval(() => {
      // console.log('interviewing the interval');
    }, 500);

    this.queryObject = { ...this.queryObject, ...date };
    this.queryObject.page = 1;
    // // console.log(this.queryObject );
    this.getAllOrderList(this.queryObject);
  }

  searchTransactionNumber(transaction_number = "") {
    this.queryObject["transaction_number"] = transaction_number;
    this.queryObject.page = 1;
    this.getAllOrderList(this.queryObject);
  }

  sortDeliveryByType(delivery_type = "") {
    this.queryObject.page = 1;
    this.queryObject["delivery_type"] = delivery_type;
    this.getAllOrderList(this.queryObject);
  }
  sortIsItemBranding(is_item_branding = "") {
    this.queryObject.page = 1;
    this.queryObject["is_item_branding"] = is_item_branding;
    this.getAllOrderList(this.queryObject);
  }
  sortOrderByStatus(order_status = "") {
    this.queryObject.page = 1;
    this.queryObject["order_status"] = order_status;
    this.getAllOrderList(this.queryObject);
  }

  sortByPaymentStatus(payment_status = "pending") {
    this.queryObject.page = 1;
    this.queryObject["payment_status"] = payment_status;
    this.getAllOrderList(this.queryObject);
  }

  handlePageChange(pageIndex) {
    if (pageIndex) {
      this.queryObject.page = pageIndex;

      this.getAllOrderList(this.queryObject);
    }
  }

  ngOnDestroy(): void {
    this._localStorage.setPage = {
      orderManagement: JSON.stringify(this.queryObject),
    };
    //  this.routerSub.unsubscribe();
  }
}
