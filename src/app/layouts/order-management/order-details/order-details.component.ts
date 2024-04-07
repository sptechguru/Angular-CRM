import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { Location} from '@angular/common';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class OrderDetailsComponent implements OnInit {
  @Input() orderID:string = '';
  isListLoading = false;
  isCommentListLoading = false;

  isCommenting = false;
  isStatusBtnEnabled = false;
  orderData;
  order_items;
  paid_amount: any;
  total_amount: any;
  pending_amount: any;
  paymentMethodType: any;
  payment_order_id: any;
  TotalProductPrice: any;
  TotalBrandingAmount: any;
  TotalGST: any;
  deliveryCharges: any;
  total_shipping_tax: any;

  constructor(
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private _localStorage: StorageAccessorService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public location : Location
  ) {
   
    
  }

  

  comment :string = '';
  dataList : any[any] = [];

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if( params.get('id')){
      this.orderID = params.get('id');
      }
      this.getOrderDetails();
      this.getAllCommentList();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if(changes.orderID){
       this.getOrderDetails();
    }
    
    
  }

  addComment(){
    if(this.comment.length === 0 || this.comment === null || this.comment === undefined) return;
    const data = {
      user_id :this._localStorage.fetchUserDetailsByKey('id'),
      order_id: this.orderID,
      comments: this.comment
    }
    // console.log(data);
    
    const url = API.CRM_ENDPOINTS.ADD_COMMENT;
    this.isCommenting = true;
    this.apiHandlerService.apiPost(url,data).subscribe({
      next:next=>{
        // console.log(next);
        this.comment = ''
      this.getAllCommentList();
        
      },
      error:err=>{
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
          this.isCommenting = false;
      },
      complete:()=>this.isCommenting = false,
    })
    
  }

  getOrderDetails() {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.ORDER_DETAILS + '/' + this.orderID;
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
          this.orderData = result.data;
          this.order_items = this.orderData.order_items;
          this.deliveryCharges = this.orderData.delivery_charges;
          this.total_shipping_tax = this.orderData.total_shipping_tax;
          this.paymentMethodType = '';
          this.paid_amount = 0;
          this.calculateProductPrice();
          this.calculateTotalGST();
          this.calculateBrandingAmount();
          this.total_amount = this.TotalProductPrice+this.TotalGST+this.deliveryCharges+this.total_shipping_tax;
          if(this.orderData.payments.length>0){
            this.paymentMethodType = this.orderData.payments[0].payment_type;
            this.payment_order_id = this.orderData.payments[0].payment_order_id;

            if(this.paymentMethodType == 'manual'){
              this.orderData.payments.forEach((data) => {
                this.paid_amount += data.amount;
              })
            }else if(this.paymentMethodType == 'online'){
              if(this.orderData.is_item_branding == 'yes'){
                this.orderData.payments.forEach((data) => {
                  if(data.payment_status == 'paid'){
                    this.paid_amount += data.amount;
                  }
                })
              }else if(this.orderData.is_item_branding == 'no'){
                this.orderData.payments.forEach((data) => {
                  if(data.payment_status == 'paid'){
                    this.paid_amount += data.amount;
                  }
                })
                /*if(this.orderData.payments[0].payment_status == 'pending'){
                  this.paid_amount = 0;
                }else if(this.orderData.payments[0].payment_status == 'paid'){
                  this.orderData.payments.forEach((data) => {
                    this.paid_amount += data.amount;
                  })
                }*/
              }
            }
          }  
          this.pending_amount = this.orderData.total_amount - this.paid_amount;
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

  calculateProductPrice(){
    this.TotalProductPrice = 0;
    this.order_items.forEach((data) => {
      this.TotalProductPrice += (data.sale_price*data.quantity + data.branding_amount);
    })
    this.TotalProductPrice = this.TotalProductPrice;
  }

  calculateBrandingAmount(){
    this.TotalBrandingAmount = 0;
    this.order_items.forEach((data) => {
      this.TotalBrandingAmount += data.branding_amount;
    })
    this.TotalBrandingAmount = this.TotalBrandingAmount;
  }

  calculateTotalGST(){
    this.TotalGST = 0;
    this.order_items.forEach((data) => {
      //this.TotalGST += ((data.sale_price * data.gst_rate)/100)*data.quantity;
      let amounts = Math.ceil(((data.sale_price * data.quantity)*data.gst_rate)/100).toFixed();
      this.TotalGST += Number(amounts);
    })
    this.TotalGST = this.TotalGST; 
  }

  searchUserByQuery(e){
    
  }

   getAllCommentList() {
    if (!this.isCommentListLoading) {
      this.isCommentListLoading = true;
      const url = API.CRM_ENDPOINTS.COMMENT_LIST;
      const limit =  10;
      let pageObj = {
       offset : 0,
       limit  : 20,
       order_id  : this.orderID
      };
     

      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          // console.log(result);
          
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            // console.log(this.dataList);

            this.dataList = this.dataList.concat();
          } else {
            this.dataList = [];
          }
       
          
          this.isCommentListLoading = false;
        },

        error: (err) => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error("", "Timeout Error");
          }
          this.isCommentListLoading = false;
        },
        complete: () => {
          this.isCommentListLoading = false;
          this.isStatusBtnEnabled = true;
        },
      });
    }
  }

  toFixedFun(val){
    if(val){
      return val;
    }else{
      return 0;
    }
  }
}
