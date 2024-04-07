import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'app-add-edit-facility',
  templateUrl: './add-edit-facility.component.html',
  styleUrls: ['./add-edit-facility.component.css']
})
export class AddEditFacilityComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private initData = {
    facility_name : '',
    facility_code : ''
  };
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  facility_name;
  facility_code;
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
    this.facility_name = this.fb.control('', [Validators.required]);
    this.facility_code = this.fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        let facilityData = JSON.parse(localStorage.getItem('facilityData'));
        this.facility_name = this.fb.control(facilityData.facility_name, [Validators.required]);
        this.facility_code = this.fb.control(facilityData.facility_code, [Validators.required]);
      } else {
        this.pageLabel = "Create";
      }
      this.createForm();
    });
  }

  createForm(): any {
    let userFormGroupStructure = {
      facility_name: [
        this.facility_name,
        Validators.required
      ],
      facility_code: [
        this.facility_code,
        Validators.required
      ],
    };

    this.addEditForm = this.fb.group(userFormGroupStructure);
  }
  prepareFormData(): any {
    let formData = new FormData();
    Object.keys(this.addEditForm.value).forEach((formControlName,index,value) => {
      this.ControlName = formControlName;
        formData.append(formControlName, this.addEditForm.get(formControlName).value.value);
    });
    return formData;
  }
  onSubmit() {
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.FACILITY_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.FACILITY_ADD;
      let addEditData = {
        facility_name:this.addEditForm.get('facility_name').value.value,
        facility_code:this.addEditForm.get('facility_code').value.value,
      };
      this.apiHandlerService.apiPost(url, addEditData,{},{ contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/facility-management']);
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
    } else {
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
}
