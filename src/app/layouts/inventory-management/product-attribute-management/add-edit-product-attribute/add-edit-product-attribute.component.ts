import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'add-edit-product-attribute',
  templateUrl: './add-edit-product-attribute.component.html',
  styleUrls: ['./add-edit-product-attribute.component.css']
})
export class AddEditProductAttributeComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  product_attribute;
  product_attribute_description
  pageLabel:string;
  ControlName;
  parent_select;
  pid: any;

  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) { 
  
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (params['pid']) {
        this.pid = params['pid'];
      }else{
        this.pid = '';
      }  
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        this.getDetailsByID();
      } else {
        this.pageLabel = "Create";
      }
      this.createForm();
    });
  }

  createForm() {
    this.addEditForm = this.fb.group({
      product_attribute: ['', [Validators.required]],
      product_attribute_description: ['', [Validators.required]]
    })
  }

  getDetailsByID(){
    const url = API.CRM_ENDPOINTS.GET_PRODUCT_ATTRIBUTE_DETAILS+'/'+this.id;
      let pageObj = {
        search_text: ''
      };
      pageObj['limit'] = 1000;
      pageObj['offset'] = 0;
    
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        let productAttributeData = resultData;
        if(productAttributeData){
          this.addEditForm.get('product_attribute').setValue(productAttributeData.product_attribute);
          this.addEditForm.get('product_attribute_description').setValue(productAttributeData.product_attribute_description);
        }
      },
      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      },
      complete: () => {}
    });  
  }

  onSubmit() {
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.PRODUCTATTRIBUTE_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.PRODUCTATTRIBUTE_ADD;      
      let uploadData = {
        "product_attribute": this.addEditForm.value.product_attribute,
        "product_attribute_description": this.addEditForm.value.product_attribute_description
      }
      this.apiHandlerService.apiPost(url, uploadData,{},{ contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.isUserProcessing = false;
            if(this.pid){
              this.router.navigate(['/crm/inventory-management/product-attribute-management/attribute-value-list/'+this.pid]);
            }else {
              this.router.navigate(['/crm/inventory-management/product-attribute-management']);
            }
            this.toasterService.Success(data.message);
          } else {
            this.isUserProcessing = false;
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
          this.isUserProcessing = false;
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
      Object.keys(this.addEditForm.controls).forEach(field => {
        const control = this.addEditForm.get(field);
        if (control.status == 'INVALID') {
          this.isUserProcessing = false;
          control.markAsDirty({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
      this.toasterService.Error('Please enter all required fields');
    }
  };
 
// get parent list

}
