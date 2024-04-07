import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class BillListComponent implements OnInit {

  dataList: Array<any> = [];
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  billData;
  shipmentData;
  orderID;

  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderID = params.get('id');
      this.getOrderShipment();
    });;
  }

  getOrderShipment() {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.GET_ORDER_SHIPMENT + '/' + this.orderID + '?offset=0&limit=1000';
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
          this.shipmentData = result.data.rows;
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
        }
      });
    }
  }

  getInvoiceFromUnicommerce(code){
      this.isListLoading = true
    this.apiHandlerService.apiGet(API.UNICOMMERCE_ENDPOINTS.GET_INVOICE_FROM_UNICOMMERCE(code)).subscribe(
      {next:result=>{
        if(result.success){
          if(result.data === null) return;
           window.open(result.data, "_blank");
        }
        // console.log(result)
      },
    error:err=>{
        // console.log(err)

    },complete : ()=>{
      this.isListLoading = false

    }}
    )
  }

  approvePayment(id: string, amount: string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are you sure you want to approved the payment of \'' + amount + '\'',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.APPROVEPAYMENT + '/' + id;
        this.isListLoading = false;
        this.isStatusBtnEnabled = false;
        this.apiHandlerService.apiPost(url, null).subscribe(
          (result: any) => {
            if (result.success === true) {
              this.toasterService.Success(result.message);
              // this.getOrderDetails();
            } else {
              this.toasterService.Error();
            }
            this.isListLoading = false;
            this.isStatusBtnEnabled = true;
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

  downloadOrderBills(orderId, shipmentId, billType) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.DOWNLOAD_ORDER_BILLS(orderId, shipmentId, billType);
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
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
        }
      });
    }
  }

  /*getOrderDetails() {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.BILL_LIST + '/' + this.orderID+'?offset=0&limit=1000';
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
          this.billData = result.data.rows;
          // console.log('result : ', this.billData);
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
        }
      });
    }
  }*/

  searchUserByQuery(e){

  }


}
