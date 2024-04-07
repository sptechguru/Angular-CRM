import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'add-edit-partner',
  templateUrl: './add-edit-partner.component.html',
  styleUrls: ['./add-edit-partner.component.css']
})
export class AddEditPartnerComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private initData = {
    business_partner : ''
  };
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  business_partner;
  pageLabel:string;
  ControlName;
  parent_select;


  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) { 
    
    this.business_partner = this.fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        // console.log('Id of the user : ', this.id);
        let partnerData = JSON.parse(localStorage.getItem('partnerData'));
        this.business_partner = this.fb.control(partnerData.business_partner, [Validators.required]);
        // this.Client_image = this.fb.control(partnerData.Client_image);
      } else {
        // this.createForm();
        this.pageLabel = "Create";
      }
      this.createForm();
    });
  }

  createForm(): any {
    // console.log('this.initData : ', this.initData);
    let userFormGroupStructure = {
      business_partner: [
        this.business_partner,
        Validators.required
      ]
    };

    this.addEditForm = this.fb.group(userFormGroupStructure);
  }
  prepareFormData(): any {
    let formData = new FormData();
    Object.keys(this.addEditForm.value).forEach((formControlName,index,value) => {
      this.ControlName = formControlName;
        formData.append(formControlName, this.addEditForm.get(formControlName).value.value);
        // formData[formControlName] = this.addEditForm.get(formControlName).value.value;
    });
    return formData;
  }
  onSubmit() {
    // console.log('this.addEditForm.valid : ', this.addEditForm);
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.PARTNER_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.PARTNER_ADD;
    
      // let addEditData = this.prepareFormData();
      // // console.log(this.binEncode(this.Client_image));
      let addEditData = {
        business_partner:this.addEditForm.get('business_partner').value.value
      };
      this.apiHandlerService.apiPost(url, addEditData,{}).subscribe({
        next: (data) => {
          if (data.success) {
            // console.log('success',data)
            this.router.navigate(['/crm/partner-management']);
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
          // console.log('Error obj : ', err);
          // // console.log('Error : ', typeof err.error);
          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        },
        complete: () => {
          this.isUserProcessing = false;
        }
      });
    } else {
      // if form is not valid
      Object.keys(this.addEditForm.controls).forEach(field => {
        const control = this.addEditForm.get(field);
        if (control.status == 'INVALID') {
          control.markAsDirty({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
      this.toasterService.Error('Please enter all required fields');
      // console.log('getFormValidationErrors(this.addEditForm.controls) : ', getFormValidationErrors(this.addEditForm.controls));
    }
  };
 
// get parent list

}
