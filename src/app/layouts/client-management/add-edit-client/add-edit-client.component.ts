import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.css']
})
export class AddEditClientComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private initData = {
    business_client : ''
  };
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  business_client;
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
    
    this.business_client = this.fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        let clientData = JSON.parse(localStorage.getItem('clientData'));
        this.business_client = this.fb.control(clientData.business_client, [Validators.required]);
      } else {
        this.pageLabel = "Create";
      }
      this.createForm();
    });
  }

  createForm(): any {
    let userFormGroupStructure = {
      business_client: [
        this.business_client,
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
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.CLIENT_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.CLIENT_ADD;
    
      let addEditData = {
        business_client:this.addEditForm.get('business_client').value.value
      };
      this.apiHandlerService.apiPost(url, addEditData,{}).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/client-management']);
            this.toasterService.Success(data.message);
          } else {
            if (data.error && data.error.message) {
              this.toasterService.Error(data.error.message.split("Validation error: ").pop());
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
            this.toasterService.Error(err.error.message.split("Validation error: ").pop());
          }
          this.isUserProcessing = false;
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
    }
  };
 
// get parent list

}
