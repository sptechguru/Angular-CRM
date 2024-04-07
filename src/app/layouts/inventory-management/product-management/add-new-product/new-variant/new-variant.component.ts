import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatStepper } from "@angular/material/stepper";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationDialogHandlerService } from "app/shared/components/confirmation-dialog/confirmation-dialog-handler.service";
import { API } from "app/shared/constants/endpoints";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, TimeoutError } from "rxjs";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function price(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (control.value !== undefined && control.value < 1) {
    return { negative: true };
  }
  return null;
}
@Component({
  selector: "app-new-variant",
  templateUrl: "./new-variant.component.html",
  styleUrls: ["./new-variant.component.css"],
  providers: [ConfirmationDialogHandlerService],
})
export class NewVariantComponent implements OnInit, OnChanges {
  @Input() stepper: MatStepper;
  @Input() variantId;
  @Input() variantData;
  @Output() variantLength: EventEmitter<any> = new EventEmitter();
  @Output() variantIdList: EventEmitter<any> = new EventEmitter();
  @Output() variantAddUpdate: EventEmitter<any> = new EventEmitter();
  variantIdList1 = [];
  varientForm: FormGroup;
  taxTypeClassList: Array<any> = [];
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagesCtrl = new FormControl();
  filteredtagess: Observable<string[]>;
  tagess: { tag_name: string; id: number | "" }[] = [];
  alltagess: string[] = ["Apple", "Lemon", "Lime", "Orange", "Strawberry"];
  remaingTags: number;
  intialTagLenght: number;
  more: boolean = false;
  editProductId;
  variantAttributeList = [];
  previousvariantAttributeList = [];
  attributeOptionList;
  isUserProcessing = false;
  attributeValueList;
  variantTagsData = {};
  defaultStatus = false;
  priceshow: any = "";
  group_per: any;
  varint_data: any;
  group_status: boolean = true;
  @ViewChild("tagesInput") tagesInput: ElementRef<HTMLInputElement>;
  @Output() variantEditData: EventEmitter<any> = new EventEmitter();
  public Editor = ClassicEditor;
  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ["clean"], // remove formatting button

      ["link", "image", "video"], // link and image, video
    ],
  };
  price: any = [
    { name: "5", value: "5" },
    { name: "10", value: "10" },
    { name: "15", value: "15" },
    { name: "20", value: "20" },
    { name: "25", value: "25" },
    { name: "30", value: "30" },
    { name: "35", value: "35" },
    { name: "40", value: "40" },
    { name: "45", value: "45" },
    { name: "50", value: "50" },
    { name: "55", value: "55" },
    { name: "60", value: "60" },
    { name: "65", value: "65" },
    { name: "70", value: "70" },
    { name: "75", value: "75" },
    { name: "80", value: "80" },
    { name: "85", value: "85" },
    { name: "90", value: "90" },
    { name: "95", value: "95" },
    { name: "100", value: "100" },
  ];
  addressDisabled: boolean = true;
  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.variantData.length > 0) {
      // console.log('catch variant data');
      this.editProductId = this.activeRoute.snapshot.paramMap.get("id");
      // console.log("NewDD", this.editProductId)
      if (this.editProductId) {
        let variantArray = this.varientForm.get("varientlist") as FormArray;
        variantArray.clear();
        for (let i = 0; i < this.variantData.length; i++) {
          variantArray.push(this.getvarientFormGroup());
          this.variantIdList1.push({
            variant_id: this.variantData[i].id,
            title: this.variantData[i].variant_name,
          });
          variantArray.controls[i].patchValue(this.variantData[i]);
          variantArray.controls[i].get("search_keyword").setValue("");
          if (this.variantData[i].product_tags.length > 0) {
            let ar = variantArray.controls[i].get("product_tags") as FormArray;
            for (let j of this.variantData[i].product_tags) {
              ar.push(this.getTagFormGroup(j));
            }
          }
          this.variantAttributeList.push([
            this.variantData[i].attribute_values,
          ]);
          let ar = [];
          if (this.variantData[i].attribute_values.length > 0) {
            for (let j of this.variantData[i].attribute_values) {
              ar.push({
                master_product_attribute_id: j.master_product_attribute_id,
                attribute_value: [j.attribute_value],
              });
            }
            // console.log(ar);
          }
          this.previousvariantAttributeList.push([ar]);
        }
      }
      // console.log(this.variantAttributeList);
      // console.log(this.variantIdList1);
    }
  }

  stringToJSON(str): any[] {
    return str?.split(",");
  }

  ngOnInit(): void {
    this.editProductId = this.activeRoute.snapshot.paramMap.get("id");
    this.initForm();
    this.getGstTaxTypeClass();
    this.getAllProductAttributeList();
    this.editProductId = this.activeRoute.snapshot.paramMap.get("id");
    if (this.editProductId) {
      this.getProductDetails();
    }
  }

  initForm() {
    this.varientForm = this.fb.group({
      varientlist: this.fb.array([this.getvarientFormGroup()]),
    });
  }

  getvarientFormGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      variant_name: ["", Validators.required],
      base_price: ["", [Validators.required, price]],
      gst_tax_type_class_id: ["", [Validators.required]],
      max_retail_price: ["", [Validators.required, price]],
      group_percentage: ["", [Validators.required]],
      max_base_price: [""],
      package_quantity: ["", [Validators.required]],
      package_avaibility: ["", [Validators.required]],
      minimum_order_quantity: ["", [Validators.required]],
      color_map: ["", [Validators.required]],
      display_dimension: ["", [Validators.required]],
      display_dimension_with_packing: ["", [Validators.required]],
      weight: ["", [Validators.required]],
      weight_with_packing: ["", [Validators.required]],
      hsn_code: ["", [Validators.required]],
      search_keyword: [""],
      // quantity:['',Validators.required],
      //reserve_stock:['',[Validators.required]],
      default: ["", Validators.required],
      product_tags: this.fb.array([]),
      // product_sku: [''],
      //reserve_stock: [''],
      //minimum_quantity_of_reserve_stock: [''],
      //reserve_stock_dishpatch_time: [''],
      //live_stock_dishpatch_time: [''],
      youtube_link: [
        "",
        [Validators.pattern("^(https?://)?(www.youtube.com|youtu.?be)/.+$")],
      ],
      variant_description: [""],
      catalogue_description: [""],
      sample_price: [0],
      sample_price_tax: [0],
      customisation_type: [""],
      customisation_sample: ["no"],
      customisation_position: [""],
      customisation_location: [""],
      customisation_cost: [0],
      customisation_possible: ["", Validators.required],
      moq_ready_stock: ["", Validators.required],
      moq_made_for_order: ["", Validators.required],
      moq_customisation_order: ["", Validators.required],
      moq_customised_box: ["", Validators.required],
      view_flat_price: ["", Validators.required],
      sample_availability: ["", Validators.required],
      status: ["inactive", Validators.required],
      attribute: this.fb.group({
        attributType: "",
        attribute_value: "",
      }),
    });
  }

  getProductDetails() {
    this.spinner.show();
    const url =
      API.CRM_ENDPOINTS.PRODUCT_DETAILS_NEW + "/" + this.editProductId;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        console.log(result.data);
        this.priceshow = result.data.product_variants[0].max_base_price;
        this.group_per = result.data.product_variants[0].group_percentage;
        // console.log(this.group_per );  

        // this.varientForm.patchValue({
        //   variant_description:'result.data',
        //   catalogue_description:'result.data'

        // })
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  getPrice() {
    // console.log( this.varientForm.value.varientlist[0].group_percentage);
    this.group_status = false;
    let datval = this.varientForm.value.varientlist[0];
    let base = datval.base_price;
    let per = datval.group_percentage;
    let total = (base * per) / 100;
    let max_base = total + base;
    let roundoff = Math.round(max_base);
    // console.log(max_base);
    this.priceshow = roundoff;
  }

  getBasePrice() {
    let datval = this.varientForm.value.varientlist[0];
    let base = datval.base_price;
    let per = datval.group_percentage ? datval.group_percentage : 0;
    let total = (base * per) / 100;
    let max_base = total + base;
    // console.log(base);
    let roundoff = Math.round(max_base);
    // console.log(max_base);
    this.priceshow = roundoff

  }

  getTagFormGroup(data) {
    return this.fb.group({ id: [data.id], tag_name: [data.tag_name] });
  }
  addVarientOptionName() {
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    varientlist.push(this.getvarientFormGroup());
    /*if(this.editProductId){
      this.variantAddUpdate.emit({type:'add',index:varientlist.length});
    }
    else{
      this.variantLength.emit(varientlist.length.toString());
    }
    */
  }
  getGstTaxTypeClass() {
    const url = API.CRM_ENDPOINTS.GST_TAX_TYPE_LIST + "?offset=0&limit=1000";
    let pageObj = {
      search_text: "",
    };
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.taxTypeClassList = resultData.rows;
          this.taxTypeClassList = this.taxTypeClassList.concat();
          // console.log(this.taxTypeClassList);

        } else {
          this.taxTypeClassList = [];
        }
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
      complete: () => { },
    });
  }
  add(ctrl, index, event: MatChipInputEvent): void {
    // console.log(event.value);
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    let ar = varientlist.controls[index].get("product_tags") as FormArray;
    ar.push(this.getTagFormGroup({ id: null, tag_name: event.value }));
    /*let tags = ctrl.value.split(',');
    if (!tags.find(ele => ele === event.value)) {
      ctrl.value = `${tags},${event.value}`;
    }
    this.variantTagsData[index] = ctrl.value;
    */
  }

  remove(ctrl, index, tag, tagIndex): void {
    // console.log(tag);
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    let ar = varientlist.controls[index].get("product_tags") as FormArray;
    if (tag.id) {
      let url = API.CRM_ENDPOINTS.VARIANT_TAG_DELETE + "/" + tag.id;
      this.apiHandlerService.apiPost(url, null).subscribe(
        (result: any) => {
          if (result.success === true) {
            ar.removeAt(tagIndex);
            //this.toasterService.Success(result.message);
          } else {
            this.toasterService.Error();
          }
        },
        (err) => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error("", "Timeout Error");
          }
        }
      );
    } else {
      ar.removeAt(tagIndex);
    }
    /*  let tags = ctrl.value.split(',');
      tags = tags.filter(ele => { return ele !== tag });
      ctrl.value = tags.join();
      this.variantTagsData[index] = ctrl.value;
      */
  }

  deleteVarient(index: any) {
    this.confirmationDialogHandlerService
      .openDialog({
        question: "Are sure you want to delete ?",
        confirmText: "Yes",
        cancelText: "No",
      })
      .subscribe((result) => {
        // console.log(result);
        if (result) {
          this.spinner.show();
          let varientlist = this.varientForm.get("varientlist") as FormArray;
          if (varientlist.controls[index].get("id").value) {
            let url =
              API.CRM_ENDPOINTS.PRODUCTVARIANT_DELETE +
              "/" +
              varientlist.controls[index].get("id").value;
            this.apiHandlerService.apiPost(url, null).subscribe(
              (result: any) => {
                if (result.success === true) {
                  this.spinner.hide();
                  this.toasterService.Success(result.message);
                  varientlist.removeAt(index);
                  this.variantAddUpdate.emit({ type: "delete", index: index });
                  this.variantIdList1.splice(index, 1);
                  this.variantAttributeList.splice(index, 1);
                  this.previousvariantAttributeList.splice(index, 1);
                  //this.variantLength.emit(varientlist.length.toString());
                } else {
                  this.toasterService.Error();
                }
              },
              (err) => {
                this.spinner.hide();
                if (err instanceof TimeoutError) {
                  this.toasterService.Error("", "Timeout Error");
                }
              }
            );
          } else {
            varientlist.removeAt(index);
            // this.variantLength.emit(varientlist.length.toString());
            if (this.editProductId) {
              this.variantAddUpdate.emit({ type: "delete", index: index });
            }
            this.spinner.hide();
          }
        }
      });
  }
  setSampleAbility(event, index) {
    // console.log("change event sample");
    // console.log(event);
    if (event.value == "yes") {
      // console.log(this.varientForm.get('varientlist'));
      let varientlist = this.varientForm.get("varientlist") as FormArray;
      let group = varientlist.controls[index] as FormGroup;
      // console.log(group);
      group.controls.sample_price.setValue(0);
      group.controls.sample_price_tax.setValue(0);
    }
  }
  setCustomisation(event, index) {
    // console.log("change event customisation");
    // console.log(event);
    if (event.value == "yes") {
      let varientlist = this.varientForm.get("varientlist") as FormArray;
      let group = varientlist.controls[index] as FormGroup;
      // console.log(group);
      group.controls.customisation_cost.setValue(0);
      group.controls.customisation_location.setValue("");
      group.controls.customisation_position.setValue("");
      group.controls.customisation_sample.setValue("no");
      group.controls.customisation_type.setValue("");
    }
  }

  save() {
    // alert("update method");
    console.log(this.varientForm.value);
    if (this.varientForm.invalid) {
      this.varientForm.markAllAsTouched();
      this.toasterService.Error("Please fill Product Varient details");
      return;
    }
    this.defaultStatus = false;
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    for (let i = 0; i < varientlist.length; i++) {
      let group = varientlist.controls[i] as FormGroup;
      if (group.get("default").value == "yes") this.defaultStatus = true;
    }
    if (!this.defaultStatus) {
      this.toasterService.Error("Please select atleast 1 as a default variant");
      return;
    }
    // let text=[];
    // for(let i of this.tagess){
    //    text.push(i.tag_name);
    // }
    let req = this.varientForm.value.varientlist;

    let loop_index = -1;
    for (let i of req) {
      loop_index += 1;
      if (!!this.variantTagsData[loop_index]) {
        i.search_keyword = this.variantTagsData[loop_index];
      }
    }

    // if (this.varientForm.invalid)
    //  return;
    // let length = req.length;
    // let index = 0;

    let url = API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_ADD + "/" + this.variantId;
    // console.log("YESS")
    //  while(length-1>=0){
    //     this.apiHandlerService.apiPost(url,req[index],{}).subscribe({
    //       next: (data) => {
    //         if (data.success) {

    //           this.toasterService.Success(data.message);

    //         } else {
    //           if (data.error && data.error.message) {
    //             this.toasterService.Error(data.error.message);
    //           } else if (data.error && (data.error.length > 0)) {
    //             data.error.forEach(erroObj => {
    //               this.toasterService.Error(erroObj.msg);
    //             });
    //           } else {
    //             this.toasterService.Error('Something went wrong.');
    //           }
    //         }
    //       },
    //       error: (err) => {
    //         if (typeof err == 'string') {
    //           this.toasterService.Error(err);
    //         } else if (err.error && err.error.message) {
    //           this.toasterService.Error(err.error.message);
    //         }

    //       },
    //       complete: () => {

    //       }
    //     });
    //     index++;
    //     length--;
    //   }

    this.spinner.show();
    this.apiHandlerService.apiPost(url, req, {}).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (data.success) {
          this.variantIdList1 = this.variantIdList1.concat(data.data);
          this.variantIdList.emit(this.variantIdList1);
          if (data.data.length > 0) {
            let varientlist = this.varientForm.get("varientlist") as FormArray;
            let groupLength = varientlist.length - data.data.length;
            for (let i of data.data) {
              let group = varientlist.controls[groupLength] as FormGroup;
              group.get("id").setValue(i.variant_id);
              this.variantAttributeList.push([[]]);
              this.previousvariantAttributeList.push([[]]);
              groupLength++;
            }
            // console.log(varientlist);
          }
          if (this.editProductId) {
            this.variantAddUpdate.emit({ type: "add", index: 0 });
          }
          this.getProductDetails();
          this.variantLength.emit(data.data.length);

          //this.stepper.next();
          this.toasterService.Success(data.message);
        } else {
          if (data.error && data.error.message) {
            this.toasterService.Error(data.error.message);
          } else if (data.error && data.error.length > 0) {
            data.error.forEach((erroObj) => {
              this.toasterService.Error(erroObj.msg);
            });
          } else {
            this.toasterService.Error("Something went wrong.");
          }
        }
      },
      error: (err) => {
        this.spinner.hide();
        if (typeof err == "string") {
          this.toasterService.Error(err);
        } else if (err.error && err.error.message) {
          this.toasterService.Error(err.error.message);
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  deleteAttribute(index, attributIndex, id) {
    this.confirmationDialogHandlerService
      .openDialog({
        question: "Are sure you want to delete ?",
        confirmText: "Yes",
        cancelText: "No",
      })
      .subscribe((result) => {
        // console.log(result);
        if (result) {
          this.spinner.show();
          let url = API.CRM_ENDPOINTS.PRODUCTATTRIBUTE_VALUE_DELETE + "/" + id;
          this.apiHandlerService.apiPost(url, null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.spinner.hide();
                this.toasterService.Success(result.message);
                this.variantAttributeList[index][0].splice(attributIndex, 1);
                this.previousvariantAttributeList[index][0].splice(
                  attributIndex,
                  1
                );
              } else {
                this.toasterService.Error();
              }
            },
            (err) => {
              this.spinner.hide();
              if (err instanceof TimeoutError) {
                this.toasterService.Error("", "Timeout Error");
              }
            }
          );
        }
      });
  }

  addAttribute(index) {
    // console.log(index);
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    let group = varientlist.controls[index] as FormGroup;
    // console.log(group.controls.attribute.value);
    if (!group.controls.attribute.value.attributType) {
      this.toasterService.Error("", "Invalid Attribute Type");
      return;
    }
    if (!group.controls.attribute.value.attribute_value) {
      this.toasterService.Error("", "Invalid Attribute Value");
      return;
    }
    // console.log(this.previousvariantAttributeList);
    let ar = this.previousvariantAttributeList[index][0].concat({
      master_product_attribute_id: group.controls.attribute.value.attributType,
      attribute_value: [group.controls.attribute.value.attribute_value],
    });
    let req = { attribute_list: ar };
    // console.log(req);
    this.isUserProcessing = true;
    let url;
    url =
      API.CRM_ENDPOINTS.ADDATTRIBUTE_VARIANT + "/" + group.controls.id.value;
    this.apiHandlerService.apiPost(url, req, {}).subscribe({
      next: (data) => {
        // console.log(data);
        group.controls.attribute.reset();
        if (data.success) {
          this.isUserProcessing = false;
          this.getAllAttributeValueList(group.controls.id.value, index);
          this.toasterService.Success(data.message);
        } else {
          if (data.error && data.error.message) {
            this.toasterService.Error(data.error.message);
          } else if (data.error && data.error.length > 0) {
            data.error.forEach((erroObj) => {
              this.toasterService.Error(erroObj.msg);
            });
          } else {
            this.toasterService.Error("Something went wrong.");
          }
        }
      },
      error: (err) => {
        this.isUserProcessing = false;
        if (typeof err == "string") {
          this.toasterService.Error(err);
        } else if (err.error && err.error.message) {
          this.toasterService.Error(err.error.message);
        }
        this.isUserProcessing = false;
      },
      complete: () => {
        this.isUserProcessing = false;
      },
    });
  }

  getAllAttributeValueList(data, index) {
    let url;
    url = API.CRM_ENDPOINTS.ADDATTRIBUTEVALUE_VARIANT + "/" + data;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 100;
    pageObj["offset"] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.variantAttributeList[index][0] = resultData.rows;
          this.previousvariantAttributeList[index][0] = [];
          for (let i of resultData.rows) {
            this.previousvariantAttributeList[index][0].push({
              master_product_attribute_id: i.id,
              attribute_value: [i.attribute_values[0].attribute_value],
            });
          }
          // console.log(this.previousvariantAttributeList[index]);
          //this.attributeValueList = resultData.rows;
          //this.attributeValueList = this.attributeValueList.concat();
        }
      },

      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
      complete: () => { },
    });
  }

  /* onSubmit(){
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
     this.isUserProcessing=true;
     let valueList = {};
     if(this.variantId){
       valueList["attribute_list"] = [];
       if(this.attributeValueList){
         this.attributeValueList.forEach((AttributeList, i) => {
           if(AttributeList.id == this.productForm.value.id){
              valueList["attribute_list"].push({"master_product_attribute_id": this.productForm.value.id,
              "attribute_value": data});
           }else{
              let result = AttributeList.attribute_values.map(s => s.attribute_value);
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
       url = API.CRM_ENDPOINTS.ADDATTRIBUTE_VARIANT + '/' + JSON.parse(id);
       this.apiHandlerService.apiPost(url, valueList,{}).subscribe({
         next: (data) => {
           console.log(data);
           if (data.success) {
            
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
  */

  getAllProductAttributeList() {
    const url = API.CRM_ENDPOINTS.PRODUCTATTRIBUTE_LIST;
    const limit = 1000000;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = limit;
    pageObj["offset"] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.attributeOptionList = resultData.rows;
        } else {
          this.attributeOptionList = [];
        }
      },

      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },

      complete: () => { },
    });
  }
  defaultChanges(data, index) {
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    if (data.value == "yes") {
      for (let i = 0; i < varientlist.length; i++) {
        let group = varientlist.controls[i] as FormGroup;
        group.get("default").setValue("no");
      }
      let group = varientlist.controls[index] as FormGroup;
      group.get("default").setValue(data.value);
    }
  }
  copy(index) {
    let varientlist = this.varientForm.get("varientlist") as FormArray;
    let group = varientlist.controls[index] as FormGroup;
    varientlist.push(this.getvarientFormGroup());
    let group1 = varientlist.controls[varientlist.length - 1] as FormGroup;
    group1.patchValue(group.value);
    group1.controls.id.setValue(null);
  }
  //stepper.next();
}
