import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  private initData = {
    product_name : '',
    product_description:'',
    master_product_category_id:'',
    master_business_client_id: '',
    master_business_partner_id: '',
    master_business_type_id: '',
    branding_possibilities: '',
    product_service_type: '',
    status:''
  };
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private dataList: Array<object> = [];
  product_name;
  product_description;
  master_product_category_id;
  master_business_client_id;
  master_business_partner_id;
  master_business_type_id;
  branding_possibilities;
  product_service_type;
  status;
  pageLabel:string;
  ControlName;
  parent_select;
  categoryList;
  clientList;
  partnerList;
  businessTypeList;
  productId;

  statusList:Array<any> = [
    {id:'active',title:'Active'},
    {id:'inactive',title:'Inactive'}
  ];


  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) { 
    
    this.product_name = this.fb.control('', [Validators.required]);
    this.product_description = this.fb.control('', [Validators.required]);
    this.master_product_category_id = this.fb.control('', [Validators.required]);
    this.master_business_client_id = this.fb.control('', [Validators.required]);
    this.master_business_partner_id = this.fb.control('', [Validators.required]);
    this.master_business_type_id = this.fb.control('', [Validators.required]);
    this.branding_possibilities = this.fb.control('', [Validators.required]);
    this.product_service_type = this.fb.control('', [Validators.required]);
    this.status = this.fb.control('', [Validators.required]);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if(params['pid']){
        this.productId = params['pid'];
      }
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        let productData = JSON.parse(localStorage.getItem('productData'));
        this.product_name = this.fb.control(productData.product_name, [Validators.required]);
        this.product_description = this.fb.control(productData.product_description, [Validators.required]);
        this.master_product_category_id = this.fb.control(productData.master_product_category_id, [Validators.required]);
        this.master_business_client_id = this.fb.control(productData.master_business_client_id, [Validators.required]);
        this.master_business_partner_id = this.fb.control(productData.master_business_partner_id, [Validators.required]);
        this.master_business_type_id = this.fb.control(productData.master_business_type_id, [Validators.required]);
        this.branding_possibilities = this.fb.control(productData.branding_possibilities, [Validators.required]);
        this.product_service_type = this.fb.control(productData.product_service_type, [Validators.required]);
        this.status = this.fb.control(productData.status, [Validators.required]);
      } else {
        this.pageLabel = "Create";
      }
      this.createForm();
    });
    this.getAllCategoryList();
    this.getAllClientList();
    this.getAllPartnerList();
    this.getAllBusinessTypeList();
  }

  createForm(): any {
    let userFormGroupStructure = {
      product_name: [
        this.product_name,
        Validators.required
      ],
      product_description: [
        this.product_description,
        Validators.required
      ],
      master_product_category_id: [
        this.master_product_category_id,
        Validators.required
      ],
      master_business_client_id: [
        this.master_business_client_id,
        Validators.required
      ],
      master_business_partner_id: [
        this.master_business_partner_id,
        Validators.required
      ],
      master_business_type_id: [
        this.master_business_type_id,
        Validators.required
      ],
      branding_possibilities: [
        this.branding_possibilities,
        Validators.required
      ],
      product_service_type: [
        this.product_service_type,
        Validators.required
      ],
      status: [
        this.status,
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
    });
    return formData;
  }


  onSubmit() {
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.PRODUCT_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.PRODUCT_ADD;
      let addEditData = {
          product_name : this.addEditForm.get('product_name').value.value,
          product_description:this.addEditForm.get('product_description').value.value,
          master_product_category_id:this.addEditForm.get('master_product_category_id').value.value,
          master_business_client_id: this.addEditForm.get('master_business_client_id').value.value,
          master_business_partner_id: this.addEditForm.get('master_business_partner_id').value.value,
          master_business_type_id: this.addEditForm.get('master_business_type_id').value.value,
          branding_possibilities: this.addEditForm.get('branding_possibilities').value.value,
          product_service_type: this.addEditForm.get('product_service_type').value.value,
          status:this.addEditForm.get('status').value.value
      };
      this.apiHandlerService.apiPost(url, addEditData,{}).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/inventory-management/product-management']);
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
 
  getAllCategoryList() {
    const url = API.CRM_ENDPOINTS.CATEGORY_LIST;
    let pageObj = {
      search_text: ''
    };
    pageObj['limit'] = 5000;
    pageObj['offset'] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.categoryList = resultData.rows;
          this.categoryList = this.categoryList.concat();
        } else {
          this.categoryList = [];
        }
      },

      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      }
    });
  }
  
  getAllClientList() {
    const url = API.CRM_ENDPOINTS.CLIENT_LIST;
    let pageObj = {
      search_text: ''
    };
    pageObj['limit'] = 5000;
    pageObj['offset'] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.clientList = resultData.rows;
          this.clientList = this.clientList.concat();
        } else {
          this.clientList = [];
        }
      },

      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      }
    });
  }
  
  //get client list

  getAllPartnerList() {
    const url = API.CRM_ENDPOINTS.PARTNER_LIST;
    let pageObj = {
      search_text: ''
    };
    pageObj['limit'] = 5000;
    pageObj['offset'] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.partnerList = resultData.rows;
          this.partnerList = this.partnerList.concat();
        } else {
          this.partnerList = [];
        }
      },

      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      }
    });
  }
  
  //get client list

  getAllBusinessTypeList() {
    const url = API.CRM_ENDPOINTS.BUSINESSTYPE_LIST;
    let pageObj = {
      search_text: ''
    };
    pageObj['limit'] = 5000;
    pageObj['offset'] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.businessTypeList = resultData.rows;
          this.businessTypeList = this.businessTypeList.concat();
        } else {
          this.businessTypeList = [];
        }
      },

      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      }
    });
  }
}
