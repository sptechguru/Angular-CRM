import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-add-branding-amount',
  templateUrl: './add-branding-amount.component.html',
  styleUrls: ['./add-branding-amount.component.css']
})
export class AddBrandingAmountComponent implements OnInit {

  model:any = {
    branding_amount:''
  }
  pid;
  vid;
  quantity;
  isUserProcessing = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) { 
    
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.pid = params.get('id');
      this.vid = params.get('vid');
      this.quantity = params.get('quantity');
    });
  }

  onSubmit(amountForm){
    if(amountForm.valid){
      let amount = {branding_amount : this.model.branding_amount*this.quantity};
      this.isUserProcessing = true;
      let url = API.CRM_ENDPOINTS.BRANDINGAMOUNT_ADD + '/' + this.pid + '/' + this.vid;
      this.apiHandlerService.apiPost(url, amount).subscribe({
        next: (response:any)=>{
          this.isUserProcessing = false;
          if(response.success){
            this.toasterService.Success(response.message);
            this.router.navigate(['/crm/order-management/order-details', this.pid])
          }
          else{
            this.toasterService.Error(response.message);
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
