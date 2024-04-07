import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
@Output() data=new EventEmitter();
@Input() stepper:MatStepper;
@Input() product;
@Input() variantId;
action=new FormControl('');
  constructor( public toasterService: ToasterService,
    public router: Router,
    public apiHandlerService: ApiHandlerService,) { }

  ngOnInit(): void {
  }
  preview(){
   window.open('http://localhost:4500/preview/'+this.variantId,'_blank');
    
  }
  submit(){
   this.router.navigate(['crm/inventory-management/product-management']);
  
  }
  save(){
   console.log(this.product);
   let url = API.CRM_ENDPOINTS.PRODUCT_ADD;
   let req={'product_name':this.product.product_name,'master_product_category_id':this.product.master_product_category_id,
   'product_description':this.product.short_product_description};
   this.apiHandlerService.apiPost(url, req,{}).subscribe({
    next: (data) => {
      console.log(data);
      if (data.success) {
        this.toasterService.Success(data.message);
      } else {
        if (data.error && data.error.message) {
          this.toasterService.Error(data.error.message);
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
     console.log(err); 
    },
    
  });
  }
}




