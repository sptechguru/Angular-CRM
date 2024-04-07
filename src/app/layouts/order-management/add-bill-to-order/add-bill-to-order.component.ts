import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-add-bill-to-order',
  templateUrl: './add-bill-to-order.component.html',
  styleUrls: ['./add-bill-to-order.component.css']
})
export class AddBillToOrderComponent implements OnInit {
  
  order_id: any;
  shipment_id: any;
  addEditBillForm: FormGroup;
  challan: any;
  invoice: any;
  eway_bill: any;
  files: any;
  isUserProcessing: boolean = false;
  //url: any = "../../assets/images/default-profile.png";
  url: any;

  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.order_id = params['id'];
     // this.order_id = 72;
      this.shipment_id = params['sid'];
      this.createForm();
    });
  }

  createForm(): any {
    this.addEditBillForm = this.fb.group({
      challan: [''],
      invoice: [''],
      eway_bill: ['']
  });
  }

  onFileChange(event, type) {
    if(type == 'challan'){
      this.challan = event.target.files;
      if (!this.challan) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.addEditBillForm.get('challan').setValue(this.challan[0]);
        this.url = e.target.result;
      };
      reader.readAsDataURL(this.challan[0]);
    }else if(type == 'invoice'){
      this.invoice = event.target.files;
      if (!this.invoice) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.addEditBillForm.get('invoice').setValue(this.invoice[0]);
        this.url = e.target.result;
      };
      reader.readAsDataURL(this.invoice[0]); 
    } else if(type == 'eway_bill'){
      this.eway_bill = event.target.files;
      if (!this.eway_bill) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.addEditBillForm.get('eway_bill').setValue(this.eway_bill[0]);
        this.url = e.target.result;
      };
      reader.readAsDataURL(this.eway_bill[0]);
    }  
  }

  onSubmit() {
    this.isUserProcessing = true;
    const uploadData = new FormData();
    uploadData.append('challan', this.addEditBillForm.get('challan').value);
    uploadData.append('invoice', this.addEditBillForm.get('invoice').value);
    uploadData.append('eway_bill', this.addEditBillForm.get('eway_bill').value);
      let url = API.CRM_ENDPOINTS.ADDBILLTOORDER+'/'+this.order_id+'/'+this.shipment_id;
      this.apiHandlerService.apiPost(url, uploadData, {}, { contentType: { isFormDataContent: true }})
      .subscribe((data) => {
        if(data.success){
          this.toasterService.Success(data.message);
          this.isUserProcessing = false;
          this.router.navigate(['/crm/order-management/bill-list', this.order_id])
        }
      },error => {
        this.toasterService.Success(error.message);
        this.isUserProcessing = false;
        this.router.navigate(['/crm/order-management/bill-list', this.order_id])
      }) ;
  }  
 
}
