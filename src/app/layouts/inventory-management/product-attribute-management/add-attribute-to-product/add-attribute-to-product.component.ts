import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'add-attribute-to-product',
  templateUrl: './add-attribute-to-product.component.html',
  styleUrls: ['./add-attribute-to-product.component.css']
})
export class AddAttributeToProductComponent implements OnInit {

  attributeList;
  isUserProcessing:boolean = false;
  typeDetails;
  productId;
  variantId;
  queryObject: any;
  productAttributeData: any;
  productForm: FormGroup;
  label: any;
  seedData: any;
  dataModel: any;
  storeData: any;
  linesFormArray: any;
  attributeValueList: any;

  constructor(
    public toasterService: ToasterService,
    public apiHandlerService: ApiHandlerService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { 
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if(params['pid']){
        this.label = 'Add';
        this.productId = params['pid'];
      }else{
        this.productId = '';
      }
      if(params['vid']){
        if(localStorage.getItem('productAttributeData')){
          this.label = 'Edit';
          this.variantId = params['vid'];
        }else{
          this.label = 'Add';
          this.productId = params['pid'];
        }
      }else{
        localStorage.removeItem('productAttributeData')
        this.variantId = '';
      }
    });

    this.queryObject = {
      page: 1,
      search_text: ''
    }
    this.getAllProductAttributeList();
    this.typeDetails = JSON.parse(localStorage.getItem('setAttributeData'));
    this.dataModel = Object.create(null);
    this.productForm = this.fb.group({
      id: ["", [Validators.required]],
      attribute_values: this.fb.array([])
    });
    this.productForm.valueChanges.subscribe(data => {
      this.dataModel = data;
    });
    if(localStorage.getItem('productAttributeData')){
      this.seedData = JSON.parse(localStorage.getItem('productAttributeData'));
      for (let line = 0; line < this.seedData.attribute_values.length; line++) {
        this.loadForm(this.seedData);
      }
    }else{
      this.seedData = {
        product_attribute: "",
        attribute_values: [
          {
            attribute_value: ""
          }
        ]
      };
      this.loadForm(this.seedData);
    }
    this.queryObject = {
      page: 1,
      search_text: ''
    }
    this.getAllAttributeValueList(this.queryObject);
  }

  getAllProductAttributeList() {
    const url = API.CRM_ENDPOINTS.PRODUCTATTRIBUTE_LIST;
    const limit = 1000000;
    let pageObj = {
      search_text: ''
    };
    pageObj['limit'] = limit;
    pageObj['offset'] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.attributeList = resultData.rows;
        } else {
          this.attributeList = [];
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

  getAllAttributeValueList(data) {
      let url;
      this.typeDetails.type == 'Product' ?
      url = API.CRM_ENDPOINTS.ADDATTRIBUTEVALUE_PRODUCT + '/' + JSON.parse(this.typeDetails.id) 
      : 
      url = API.CRM_ENDPOINTS.ADDATTRIBUTEVALUE_VARIANT + '/' + JSON.parse(this.typeDetails.id);
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = 100;
      pageObj['offset'] = 0;
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.attributeValueList = resultData.rows;
            this.attributeValueList = this.attributeValueList.concat();
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

  showValue() {
    return this.productForm.getRawValue();
  }

  showSavedValue() {
    return this.dataModel;
  }

  saveForm() {
    this.storeData = this.productForm.getRawValue();
    this.productForm.reset();
    (this.productForm.get("attribute_values") as FormArray)["controls"].splice(0);
  }

  changeValueInSaveData() {
    this.productForm.get("id").setValue("changed");
  }

  loadFormAction() {
    this.loadForm(this.storeData);
  }

  loadForm(data) {
    for (let line = 0; line < data.attribute_values.length; line++) {
      this.linesFormArray = this.productForm.get("attribute_values") as FormArray;
    }
    this.linesFormArray.push(this.line());
    this.productForm.patchValue(data);
  }

  seedForm(): void {
    this.loadForm(this.seedData);
  }

  removeAttributeValue(i:number) {
    this.linesFormArray.removeAt(i);
  }

  line(): FormGroup {
    return this.fb.group({
      attribute_value: ""
    });
  }

  onSubmit(){
    let data = [];
    let attribute_id;
    if(this.productForm.value.attribute_values){
      this.productForm.value.attribute_values.forEach((value, i) => {
        if(value.attribute_value === ''){
          this.toasterService.Error("Attribute value is required");
        }else{
          attribute_id = this.productForm.value.product_attribute;
          data.push(value.attribute_value);
        } 
      });
    }
    
    let valueList = {};
    if(this.variantId){
      valueList["attribute_list"] = [];
      console.log(this.attributeValueList);
      if(this.attributeValueList){
        this.attributeValueList.forEach((AttributeList, i) => {
          if(AttributeList.id == this.productForm.value.id){
             valueList["attribute_list"].push({"master_product_attribute_id": this.productForm.value.id,
             "attribute_value": data});
          }else{
             let result = AttributeList.attribute_values.map(s => s.attribute_value);
             console.log(result);
             valueList["attribute_list"].push({"master_product_attribute_id": AttributeList.id,
             "attribute_value": result}); 
          }
       });  
      }
    }else{
      valueList["attribute_list"] = [];
      if(this.attributeValueList){
        this.attributeValueList.forEach((AttributeList, i) => {
          let result = AttributeList.attribute_values.map(s => s.attribute_value);
          valueList["attribute_list"].push({"master_product_attribute_id": AttributeList.id,
          "attribute_value": result});
        });
        valueList["attribute_list"].push({"master_product_attribute_id": this.productForm.value.id,
        "attribute_value": data});
      }else{
        valueList["attribute_list"].push({"master_product_attribute_id": this.productForm.value.id,
        "attribute_value": data});
      }
    }
    
    if(valueList){
      let url;
      this.typeDetails.type == 'Product' ?
      url = API.CRM_ENDPOINTS.ADDATTRIBUTE_PRODUCT + '/' + JSON.parse(this.typeDetails.id) 
      : 
      url = API.CRM_ENDPOINTS.ADDATTRIBUTE_VARIANT + '/' + JSON.parse(this.typeDetails.id);
    
      this.apiHandlerService.apiPost(url, valueList,{}).subscribe({
        next: (data) => {
          if (data.success) {
            if(this.variantId){
              //this.router.navigate(['/crm/inventory-management/product-attribute-management/attribute-value-list', this.productId, this.variantId]);
              this.router.navigate(['/crm/inventory-management/product-attribute-management/attribute-value-list', this.productId]);
            }else{
              this.router.navigate(['/crm/inventory-management/product-attribute-management/attribute-value-list', this.productId]);
            }
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
    }
  }        
}
