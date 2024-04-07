import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'app-contact-query-details',
  templateUrl: './contact-query-details.component.html',
  styleUrls: ['./contact-query-details.component.css']
})
export class ContactQueryDetailsComponent implements OnInit {
  id;
  isUserProcessing: boolean = false;
  contact_details: any;
  name: any;
  email: any;
  contact_number: any;
  message: any;
  company_name: any;
  created_at: any;

  constructor(
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) {

  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.getContactQueryDetails();
        //this.compensation_cess = this.fb.control(gstTaxTypeData.compensation_cess, [Validators.required]);
      }
    });
  }

  getContactQueryDetails() {
    this.isUserProcessing = true;
    let url = API.CRM_ENDPOINTS.CONTACT_QUERY_DETAILS + '/' + this.id;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (data) => {
        if (data.success) {
          this.contact_details = data.data;
          this.name = this.contact_details.name;
          this.email = this.contact_details.email;
          this.message = this.contact_details.message;
          this.contact_number = this.contact_details.phone_number;
          this.company_name = this.contact_details.company_name;
          this.created_at =  this.contact_details.created_at;
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
        this.isUserProcessing = false;
      },
      error: (err) => {
        if (typeof err == 'string') {
          this.toasterService.Error(err);
        } else if (err.error && err.error.message) {
          this.toasterService.Error(err.error.message);
        }
        this.isUserProcessing = false;
      },
      complete: () => {
        this.isUserProcessing = false;
      }
    });
  };

}
