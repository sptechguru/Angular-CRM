import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css']
})
export class AddEditCategoryComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  addEditForm: FormGroup;
  public initData = {
    product_category : '',
    parent_id: '',
    product_category_image: '',
    position:''
  };
  public packageList: Array<object> = [];
  public id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  public dataList: Array<object> = [];
  product_category;
  product_category_image;
  position;
  parent_id;
  pageLabel:string;
  ControlName;
  parent_select;
  editViewImg;
  imageRequired;

  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) { 
    
    this.product_category = this.fb.control('', [Validators.required]);
    this.product_category_image = this.fb.control('');
    this.position=this.fb.control('',[Validators.required]);
    this.parent_id = this.fb.control('');
  }

  ngOnInit() {
    this.getAllCategoryList();
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.pageLabel = "Edit";
        let categorydata = JSON.parse(localStorage.getItem('categoryData'));
        this.product_category = this.fb.control(categorydata.product_category, [Validators.required]);
        this.editViewImg = categorydata.product_category_image;
        this.position=this.fb.control(categorydata.position);
        this.parent_id = this.fb.control(categorydata.parent_category);
        this.imageRequired = true;
      } else {
        this.product_category_image = this.fb.control('', [Validators.required]);
        this.pageLabel = "Create";
        this.imageRequired = false;
      }
      this.createForm();
    });
  }

  createForm(): any {
    let userFormGroupStructure = {
      product_category: [
        this.product_category,
        Validators.required
      ],
      parent_id: [
        this.parent_id
      ],
      product_category_image: [
        this.product_category_image
      ],
      position:[
       this.position
      ]
    };

    this.addEditForm = this.fb.group(userFormGroupStructure);
  }
  getBase64 = (file) => new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject('Error: ');
})
 
  deleteImg(){
    this.editViewImg = null;
  }

  onFileChange(event) {
    const fileUpload = this.fileUpload.nativeElement;
    const file = fileUpload.files[0];
    if(file.size/1024/1024 > 4){
      this.toasterService.Error('Image size should be less than 4MB.');
      return;
    }
    else{
      this.addEditForm.patchValue({
        product_category_image: file
      });
      this.addEditForm.get('product_category_image').updateValueAndValidity()
    }
    this.imageRequired = false;
  }

  prepareFormData(): any {
    let formData = new FormData();
    Object.keys(this.addEditForm.value).forEach((formControlName,index,value) => {
      this.ControlName = formControlName;
      if(formControlName == 'product_category_image'){
        
      formData.append(formControlName, this.addEditForm.get(formControlName).value);

      }else{

        formData.append(formControlName, this.addEditForm.get(formControlName).value.value ? this.addEditForm.get(formControlName).value.value : '');
        // formData[formControlName] = this.addEditForm.get(formControlName).value.value;
      }
    });
    return formData;
  }

  onSubmit(fileUpload) {
    if(this.addEditForm.get('product_category_image').value.status == "INVALID" && this.pageLabel == "Create"){
      this.toasterService.Error('Please select category image!');
      this.imageRequired = true;
    }else{
    if (!this.isUserProcessing && this.addEditForm.valid) {
      this.isUserProcessing = true;
      let url;
      this.id? url = API.CRM_ENDPOINTS.CATEGORY_UPDATE + '/' + this.id : url = API.CRM_ENDPOINTS.CATEGORY_ADD;
      let addEditData = this.prepareFormData();
      this.apiHandlerService.apiPost(url, addEditData,{},{ contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/category-management']);
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
            this.toasterService.Error(err.split("Validation error: ").pop());
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
  }
  };
 
// get parent list

getAllCategoryList() {
    const url = API.CRM_ENDPOINTS.CATEGORY_LIST;
    let pageObj = {
      search_text: ''
    };
    pageObj['limit'] = 5000;
    pageObj['offset'] = 0;
    pageObj['category_type'] = 'parent';
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.dataList = resultData.rows;
        } else {
          this.dataList = [];
        }
      },

      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      },

      complete: () => {
      }
    });
  }
}
