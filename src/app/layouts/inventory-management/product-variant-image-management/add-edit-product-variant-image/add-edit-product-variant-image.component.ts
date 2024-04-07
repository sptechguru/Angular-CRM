import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';
import {Location} from '@angular/common';

@Component({
  selector: 'add-edit-product-variant-image',
  templateUrl: './add-edit-product-variant-image.component.html',
  styleUrls: ['./add-edit-product-variant-image.component.css']
})
export class AddEditProductVariantImageComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private initData = {
    product_variant_image : '',
    is_feature:''
  };
  private packageList: Array<object> = [];
  public id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  product_variant_image;
  is_feature;
  pageLabel:string;
  ControlName;
  parent_select;
  productList:Array<any> = [];
  editViewImg;
  variantId;
  variant_id: any;
  image_id: any;

  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private _location: Location
  ) { 
    
    this.product_variant_image = this.fb.control('', [Validators.required]);
    this.is_feature = this.fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.variantId = JSON.parse(localStorage.getItem('variantData'));
    this.activeRoute.params.subscribe(params => {
      if(params['vid']){
        this.variant_id = params['vid'];
      }
      if(params['Iid']){
        this.image_id = params['Iid'];
      }
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        let variantImageData = JSON.parse(localStorage.getItem('variantImageData'));
        this.editViewImg = variantImageData.product_variant_image;
        this.is_feature = this.fb.control(variantImageData.is_feature, [Validators.required]);
      } else {
        this.pageLabel = "Create";
      }
      this.createForm();
    });
  }

  backClicked() {
    this._location.back();
  }

  onFileChange(event) {
    
    const fileUpload = this.fileUpload.nativeElement;
    const file = fileUpload.files[0];
    this.addEditForm.patchValue({
      product_variant_image: file
    });
    this.addEditForm.get('product_variant_image').updateValueAndValidity()
  }
  createForm(): any {
    let userFormGroupStructure = {
      product_variant_image: [
        this.product_variant_image,
        Validators.required
      ],
      is_feature: [
        this.is_feature,
        Validators.required
      ]
      
    };

    this.addEditForm = this.fb.group(userFormGroupStructure);
  }
  prepareFormData(): any {
    let formData = new FormData();
    Object.keys(this.addEditForm.value).forEach((formControlName,index,value) => {
      this.ControlName = formControlName;
      if(formControlName == 'product_variant_image'){
        
      formData.append(formControlName,this.addEditForm.get(formControlName).value);

      }
      else{
        formData.append(formControlName, this.addEditForm.get(formControlName).value.value);
      }
        // formData[formControlName] = this.addEditForm.get(formControlName).value.value;
    });
    return formData;
  }
  
  getAllProductList() {
      const url = API.CRM_ENDPOINTS.PRODUCT_LIST;
      let pageObj = {
        search_text: ''
      };
      pageObj['limit'] = 5000;
      pageObj['offset'] = 0;
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.productList = resultData.rows;
            this.productList = this.productList.concat();
          } else {
            this.productList = [];
          }
        },

        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
        },

        complete: () => {
          // setTimeout(() => {
          // this.isListLoading = false;
          // }, 5000);lert
        }
      });
  }
  onSubmit() {
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.PRODUCTVARIANTIMAGE_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.PRODUCTVARIANTIMAGE_ADD + '/' + this.image_id;
      let addEditData = this.prepareFormData();
      this.apiHandlerService.apiPost(url, addEditData,{},{ contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/inventory-management/product-variant-image-management/variant-image-list/' 
            + this.variant_id +'/'+ this.image_id]);
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
