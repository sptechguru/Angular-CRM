import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError, Observable } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';  
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'add-edit-product-variant',
  templateUrl: './add-edit-product-variant.component.html',
  styleUrls: ['./add-edit-product-variant.component.css']
})
export class AddEditProductVariantComponent implements OnInit {

  addEditForm: FormGroup;
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  public Editor = ClassicEditor;
  variant_id: any;
  productId: any;
  id: any;
  taxTypeClassList:Array<any> = [];
  public isUserProcessing: boolean = false;
  pageLabel:string;

  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getGstTaxTypeClass();
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
      }
      if(params['vid']){
        this.variant_id = params['vid'];
        this.listOfTags()      
      }
    });   
    if(this.id && !this.variant_id){
      this.pageLabel = "Create";
    }
    if(this.id && this.variant_id){
      this.getProductVariantDetailsById(); 
      this.pageLabel = "Edit";
    }
  }

  createForm(): any {
    this.addEditForm = this.fb.group({
      variant_name: ['', [Validators.required]],
      base_price: ['', [Validators.required]],
      gst_tax_type_class_id: ['', [Validators.required]],
      max_retail_price: ['', [Validators.required]],
      package_quantity: ['', [Validators.required]],
      package_avaibility: ['', [Validators.required]],
      minimum_order_quantity: ['', [Validators.required]],
      color_map: ['', [Validators.required]],
      display_dimension: ['', [Validators.required]],
      display_dimension_with_packing: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      weight_with_packing: ['', [Validators.required]],
      hsn_code: ['', [Validators.required]],
      // search_keyword: ['',[Validators.required]],
      reserve_stock: ['', [Validators.required]],
      minimum_quantity_of_reserve_stock: ['', [Validators.required]],
      reserve_stock_dishpatch_time: ['', [Validators.required]],
      live_stock_dishpatch_time: ['', [Validators.required]],
      youtube_link: ['', [Validators.pattern('^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$')]],
      variant_description: [''],
      catalogue_description: [''],
    }) 
  }

  getProductVariantDetailsById(){
    let url = API.CRM_ENDPOINTS.PRODUCTVARIANT_DETAILS+'/'+this.id+'/'+this.variant_id;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        this.addEditForm.get('variant_name').setValue(resultData.variant_name);
        this.addEditForm.get('base_price').setValue(resultData.base_price);
        this.addEditForm.get('gst_tax_type_class_id').setValue(resultData.gst_tax_type_class_id);
        this.addEditForm.get('max_retail_price').setValue(resultData.max_retail_price);
        this.addEditForm.get('package_quantity').setValue(resultData.package_quantity);
        this.addEditForm.get('package_avaibility').setValue(resultData.package_avaibility);
        this.addEditForm.get('minimum_order_quantity').setValue(resultData.minimum_order_quantity);
        this.addEditForm.get('color_map').setValue(resultData.color_map);
        this.addEditForm.get('display_dimension').setValue(resultData.display_dimension);
        this.addEditForm.get('display_dimension_with_packing').setValue(resultData.display_dimension_with_packing);
        this.addEditForm.get('weight').setValue(resultData.weight);
        this.addEditForm.get('weight_with_packing').setValue(resultData.weight_with_packing);
        this.addEditForm.get('hsn_code').setValue(resultData.hsn_code);
       
        this.addEditForm.get('reserve_stock').setValue(resultData.reserve_stock);
        this.addEditForm.get('minimum_quantity_of_reserve_stock').setValue(resultData.minimum_quantity_of_reserve_stock);
        this.addEditForm.get('reserve_stock_dishpatch_time').setValue(resultData.reserve_stock_dishpatch_time);
        this.addEditForm.get('live_stock_dishpatch_time').setValue(resultData.live_stock_dishpatch_time);
        this.addEditForm.get('youtube_link').setValue(resultData.youtube_link);
        this.addEditForm.get('variant_description').setValue(resultData.variant_description);
        this.addEditForm.get('catalogue_description').setValue(resultData.catalogue_description);
      },
      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      },
      complete: () => {}
    });
  }

  getGstTaxTypeClass(){
    const url = API.CRM_ENDPOINTS.GST_TAX_TYPE_LIST+'?offset=0&limit=1000';
    let pageObj = {
      search_text: ''
    };
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.taxTypeClassList = resultData.rows;
          this.taxTypeClassList = this.taxTypeClassList.concat();
        } else {
          this.taxTypeClassList = [];
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

  onSubmit(){
  if(this.addEditForm.value.base_price > 0){
    if(this.addEditForm.valid){
      let data = {
        "variant_name": this.addEditForm.value.variant_name,
        "gst_tax_type_class_id": this.addEditForm.value.gst_tax_type_class_id,
        "base_price": this.addEditForm.value.base_price,
        "max_retail_price": this.addEditForm.value.max_retail_price,
        "variant_description": this.addEditForm.value.variant_description,
        "catalogue_description": this.addEditForm.value.catalogue_description,
        "package_quantity": this.addEditForm.value.package_quantity,
        "package_avaibility": this.addEditForm.value.package_avaibility,
        "minimum_order_quantity": this.addEditForm.value.minimum_order_quantity,
        "color_map": this.addEditForm.value.color_map,
        "display_dimension": this.addEditForm.value.display_dimension,
        "display_dimension_with_packing": this.addEditForm.value.display_dimension_with_packing,
        "weight": this.addEditForm.value.weight,
        "weight_with_packing": this.addEditForm.value.weight_with_packing,
        "hsn_code": this.addEditForm.value.hsn_code,
        "search_keyword": this.addEditForm.value.search_keyword,
        "youtube_link": this.addEditForm.value.youtube_link,
        "reserve_stock": this.addEditForm.value.reserve_stock,
        "reserve_stock_dishpatch_time": this.addEditForm.value.reserve_stock_dishpatch_time,
        "live_stock_dishpatch_time": this.addEditForm.value.live_stock_dishpatch_time,
        "minimum_quantity_of_reserve_stock": this.addEditForm.value.minimum_quantity_of_reserve_stock
      }
      let url;
      if(this.id && !this.variant_id){
        url = API.CRM_ENDPOINTS.PRODUCTVARIANT_ADD+'/'+this.id;
      }
      if(this.id && this.variant_id){
        url = API.CRM_ENDPOINTS.PRODUCTVARIANT_UPDATE+'/'+this.id+'/'+this.variant_id;
      }
      this.isUserProcessing = true;
      this.apiHandlerService.apiPost(url, data,{}).subscribe({
        next: (data) => {
          if (data.success) {
            // console.log(data);
            let tags = this.tagess.map(data=>data.tag_name)
            if(data.data){
      
              this.addTagsApi(data.data.id,tags,'add')
            } else{
              this.intialTagLenght ?  this.addTagsApi(this.variant_id,this.tagess,'update') : this.addTagsApi(this.variant_id,tags,'add')
            }
            
            this.router.navigate(['/crm/inventory-management/product-variant-management/variant-list/'+this.id]);
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
    }else{
      this.toasterService.Error("Please fill all required fields and valid youtube URL.");
    }
  }else{
    this.toasterService.Error("Please enter Base Price value more than 0.");
  }
  }


  // Add tag to products


    visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagesCtrl = new FormControl();
  filteredtagess: Observable<string[]>;
  tagess: {tag_name: string,id:number|""}[] = [];
  alltagess: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  remaingTags  : number;
  intialTagLenght: number;
  more : boolean = false;
  @ViewChild('tagesInput') tagesInput: ElementRef<HTMLInputElement>;
 

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value as string;

    // Add our tages
    if ((value || '').trim()) {
      this.tagess.push({tag_name:value,id:""})
    }


    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagesCtrl.setValue(null);
  }

  remove(tages): void {
    
     const index = this.tagess.indexOf(tages);

    if (index >= 0) {
      this.tagess.splice(index, 1);
    }

     }

  listOfTags(limit = 10){

    limit = this.more ? this.remaingTags +10 : 10;

     const api = `${API.CRM_ENDPOINTS.GET_PRODUCT_TAG}?offset=0&limit=${limit}&product_variant_id=${this.variant_id}`;
    
     
     

     this.apiHandlerService.apiGet(api).subscribe({
       next: (result: any) => {
        

        this.remaingTags = result.data.total >  10 ? result.data.total - 10 : 0;
       this.intialTagLenght = result.data.rows.length;
       console.log( result.data.rows);
       
        this.tagess = result.data.rows.map(row => {
         return{ tag_name: row.tag_name , id : row.id}
        } )    
       },
       error:err => {
         console.log(err);
         
       }
     })
  }

 
  addTagsApi(id,tags,status:'add'|'update'){
    const api = status==='add' ? API.CRM_ENDPOINTS.ADD_PRODUCT_TAG :  API.CRM_ENDPOINTS.UPDATE_PRODUCT_TAG ;

    this.apiHandlerService.apiPost(api,{product_variant_id:id,tag_name:tags}).subscribe({

     next: (result: any) => {
              if (result.success === true) {
              
                // this.toasterService.Success(result.message);
              } else {
                this.toasterService.Error();
              }
            },
    error:   err => {
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
              }
             
            }

    })
  }

  

}
