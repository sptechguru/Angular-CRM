import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class PaymentListComponent implements OnInit {

  dataList: Array<any> = [];
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  orderData;
  orderID;

  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    private activatedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderID = params.get('id');
      this.getOrderDetails();
    });;
  }

  approvePayment(id: string, amount: string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are you sure you want to approve the payment of \'' + amount + '\'',
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
                this.getOrderDetails();
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

  reciepr(val){
    return val.split(/[\s.]+/).pop();
  }

  getOrderDetails() {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.ORDER_DETAILS + '/' + this.orderID;
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
          this.orderData = result.data;
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

}
