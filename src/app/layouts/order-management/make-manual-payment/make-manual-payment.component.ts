import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-make-manual-payment',
  templateUrl: './make-manual-payment.component.html',
  styleUrls: ['./make-manual-payment.component.css']
})
export class MakeManualPaymentComponent implements OnInit {

  paymentForm: FormGroup;
  receipt: boolean = false;
  number: boolean = false;
  amount: boolean = true;
  payment: boolean = false; 
  number_label: any;
  receipt_label: any;
  id;
  isUserProcessing = false;
  paid_amount: any;
  pending_amount: any;
  file: any;
  total_amount: any;

  constructor(
    public fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) {}

  ngOnInit() {
    this.createFormValidation();
    this.paymentForm.get('payment_instrument').setValue('neft');
    this.number_label = 'Transaction Number';
    this.receipt_label = 'Transaction Receipt';
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.getOrderDetails();
  }

  createFormValidation(){
    this.paymentForm = this.fb.group({
      payment_instrument: [''],
      amount: ['', [Validators.required]],
      transaction_number: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.minLength(10)]],
      part_payment: ['', [Validators.required]],
      file: ['', [Validators.required]]
    });
  }

  getOrderDetails() {
      const url = API.CRM_ENDPOINTS.ORDER_DETAILS + '/' + this.id;
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
          this.total_amount = result.data.total_amount
          this.paid_amount = 0;
          result.data.payments.forEach((data) => {
            this.paid_amount += data.amount;
          })
          this.pending_amount = this.total_amount - this.paid_amount;
          if(this.pending_amount === 0){
            this.paymentForm.disable();
            this.toasterService.Error("No amount is pending of your order");
          }else{
            this.paymentForm.get('amount').setValue(this.pending_amount);
          }

          if(result.data.payments.length>0 && result.data.payments[0].payment_type == 'online'){
            this.paymentForm.disable();
            this.toasterService.Error("Order payment method type is online, You can not pay manually!");
          }
        },

        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
        },

        complete: () => {
        }
      });
  }

  paymentMethod(value){
    if(value === 'cash'){
      this.amount = true;
      this.payment = false;
      this.receipt = false;
      this.number = false;
    }else if(value === 'cheque'){
      this.receipt = true;
      this.number = true;
      this.payment = true;
      this.number_label = 'Cheque Number';
      this.receipt_label = 'Cheque Receipt';
      this.paymentForm.controls['amount'].enable();
    }else if(value === 'neft' || value === 'rtgs'){
      this.receipt = true;
      this.number = true;
      this.payment = true;
      this.number_label = 'Transaction Number';
      this.receipt_label = 'Transaction Receipt';
      this.paymentForm.controls['amount'].enable();
    }
  }

  onFileChange(event,getForm) {
    const file = event[0];
    this.file = event[0];
    if(file.size/1024/1024 > 4){
      this.toasterService.Error('Image size should be less than 4MB.');
      return;
    }
  }


  onSubmit(){
    if(this.paymentForm.value.payment_instrument === 'rtgs' || this.paymentForm.value.payment_instrument === 'neft'){
      let partial_amount = (this.pending_amount/100)*10;
      if(this.paymentForm.value.part_payment === 'yes'){
        if(this.paymentForm.value.amount < partial_amount){
          this.toasterService.Error("Enter amount at least 10%("+partial_amount+") of total amount");
        }else if(this.paymentForm.value.amount > this.pending_amount){
          this.toasterService.Error('Please enter amount less than of total amount');
        }/*else if(this.paymentForm.value.amount != this.pending_amount){
          this.toasterService.Error('Please enter correct amount('+this.pending_amount+'/-)');
        }*/else{
          this.manualPaymentAPI();
        }
      }else if(this.paymentForm.value.part_payment === 'no'){
        if(this.paymentForm.value.amount > this.total_amount){
          this.toasterService.Error('Please enter amount less  or equal amount of total amount');
        }else if(this.paymentForm.value.amount != this.pending_amount){
          this.toasterService.Error('Please enter correct amount('+this.pending_amount+'/-)');
        }else{
          this.manualPaymentAPI();
        }
      }
    }
  }

  manualPaymentAPI(){
      const uploadData = new FormData();
      uploadData.append('amount', this.paymentForm.value.amount);
      uploadData.append('transaction_number', this.paymentForm.value.transaction_number);
      uploadData.append('transaction_receipt', this.file);
      uploadData.append('part_payment', this.paymentForm.value.part_payment);
      uploadData.append('payment_instrument', this.paymentForm.value.payment_instrument);
      this.isUserProcessing = true; 
      let url = API.CRM_ENDPOINTS.MAKEMANUALPAYMENT + '/' + this.id;
      this.apiHandlerService.apiPost(url, uploadData,{},{ contentType: { isFormDataContent: true } }).subscribe({
        next: (response:any)=>{
          this.isUserProcessing = false;
          if(response.success){
            this.toasterService.Success(response.message);
            this.router.navigate(['/crm/order-management/order-details', this.id])
          }
          else{
            this.toasterService.Error(response.message);
          }
        },
        error: (err) => {
          // console.log('Error obj : ', err);
          this.isUserProcessing = false;
          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        } 
    })
  }
      
}
