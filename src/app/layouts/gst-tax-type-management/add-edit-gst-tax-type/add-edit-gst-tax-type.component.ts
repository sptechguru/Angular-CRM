import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'app-add-edit-gst-tax-type',
  templateUrl: './add-edit-gst-tax-type.component.html',
  styleUrls: ['./add-edit-gst-tax-type.component.css']
})
export class AddEditGstTaxTypeComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private initData = {
    gst_tax_type_code : '',
    central_gst : '',
    integrated_gst : '',
    state_gst : '',
    union_territory_gst : '',
    compensation_cess : '',
  };
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  gst_tax_type_code;
  central_gst;
  integrated_gst;
  state_gst;
  union_territory_gst;
  //compensation_cess;
  flat_gst;
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
    this.gst_tax_type_code = this.fb.control('', [Validators.required]);
    this.central_gst = this.fb.control('', [Validators.required]);
    this.integrated_gst = this.fb.control('', [Validators.required]);
    this.state_gst = this.fb.control('', [Validators.required]);
    this.union_territory_gst = this.fb.control('', [Validators.required]);
    this.flat_gst = this.fb.control('', [Validators.required]);
   // this.compensation_cess = this.fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        let gstTaxTypeData = JSON.parse(localStorage.getItem('facilityData'));
        this.gst_tax_type_code = this.fb.control(gstTaxTypeData.gst_tax_type_code, [Validators.required]);
        this.central_gst = this.fb.control(gstTaxTypeData.central_gst, [Validators.required]);
        this.integrated_gst = this.fb.control(gstTaxTypeData.integrated_gst, [Validators.required]);
        this.state_gst = this.fb.control(gstTaxTypeData.state_gst, [Validators.required]);
        this.union_territory_gst = this.fb.control(gstTaxTypeData.union_territory_gst, [Validators.required]);
        this.flat_gst = this.fb.control(gstTaxTypeData.integrated_gst, [Validators.required]);
        //this.compensation_cess = this.fb.control(gstTaxTypeData.compensation_cess, [Validators.required]);
      } else {
        this.pageLabel = "Create";
      }
      this.createForm();
    });
  }

  createForm(): any {
    let userFormGroupStructure = {
      gst_tax_type_code: [
        this.gst_tax_type_code,
        Validators.required
      ],
      central_gst: [
        this.central_gst,
        Validators.required
      ],
      integrated_gst: [
        this.integrated_gst,
        Validators.required
      ],
      state_gst: [
        this.state_gst,
        Validators.required
      ],
      union_territory_gst: [
        this.union_territory_gst,
        Validators.required
      ],
      flat_gst: [
        this.flat_gst,
        Validators.required
      ],
     // compensation_cess: [
       // this.compensation_cess,
       // Validators.required
      //]
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

  onSearchChange(value){
    this.central_gst.setValue(value/2);
    this.state_gst.setValue(value/2);
    this.union_territory_gst.setValue(value/2);
    this.integrated_gst.setValue(value);
  }

  onSubmit() {
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.GST_TAX_TYPE_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.GST_TAX_TYPE_ADD;
      let addEditData = {
        gst_tax_type_code: this.addEditForm.get('gst_tax_type_code').value.value,
        central_gst: this.addEditForm.get('central_gst').value.value,
        integrated_gst: this.addEditForm.get('integrated_gst').value.value,
        state_gst: this.addEditForm.get('state_gst').value.value,
        union_territory_gst: this.addEditForm.get('union_territory_gst').value.value,
        compensation_cess: 0
      };
      this.apiHandlerService.apiPost(url, addEditData,{},{ contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/gst-tax-type-management']);
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
