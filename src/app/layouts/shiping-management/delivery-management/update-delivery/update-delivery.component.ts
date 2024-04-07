import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-update-delivery',
  templateUrl: './update-delivery.component.html',
  styleUrls: ['./update-delivery.component.css']
})
export class UpdateDeliveryComponent implements OnInit {
did:any;
deliverypayload:any=[];
editcourier:FormGroup;
responsedata:any;
public isUserProcessing: boolean = false;
  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private activatedRoute: ActivatedRoute,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService ) { }

  ngOnInit(): void {
    this.did = this.activeRoute.snapshot.params.productid;
    // console.log(this.did);
    this.editcourier = this.fb.group({
      awb_number: ['', Validators.required],
      courier_partner: ['', Validators.required],
      courier_partner_url: ['', Validators.required],
      awb_number_availability:['',Validators.required]
    })
    this.getdeliverydetails()
  }

  getdeliverydetails()
  {
    let url = API.CRM_ENDPOINTS.Delivery_Edit + "/" + this.did;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        console.log(result)
        if (result.success) {
          this.responsedata = result.data;
          if (this.responsedata) {
                     
            this.editcourier.get('awb_number').setValue(this.responsedata.awb_number);
            this.editcourier.get('courier_partner').setValue(this.responsedata.courier_partner);
            this.editcourier.get('courier_partner_url').setValue(this.responsedata.courier_partner_url);
            this.editcourier.get('awb_number_availability').setValue(this.responsedata.awb_number_availability);

          }

        }
        else {
          this.toasterService.Error = result.error;
        }

      }
    })
  }
  updatedelivery()
  {
    if (!this.isUserProcessing && this.editcourier.valid) {
      this.isUserProcessing = true;
      let payload = {
        "id" : this.did ,       
        "awb_number": this.editcourier.get('awb_number').value,
        "courier_partner_url": this.editcourier.get('courier_partner_url').value,
        "courier_partner":this.editcourier.get('courier_partner').value,
        
      }     
      this.deliverypayload.push(payload);    
      let url = API.CRM_ENDPOINTS.Delivery_Update;
      this.apiHandlerService.apiPost(url, this.deliverypayload, {}).subscribe({
        next: (data) => {
          if (data.success) {
            // this.addnewsku.untouched="";
            this.isUserProcessing = false;          
            this.deliverypayload = [];            
            this.toasterService.Success(data.message);        
            this.getdeliverydetails();

          } else {
            this.isUserProcessing = false;
            if (data.error && data.error.message) {
              this.toasterService.Error(data.error.message);
              this.deliverypayload = [];

            } else if (data.error && (data.error.length > 0)) {
              data.error.forEach(erroObj => {
                this.toasterService.Error(erroObj.msg);
              });
            } else {
              this.toasterService.Error('Something went wrong.');
            }
          }
        },
        error: (err) => {
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
  

  

}
