import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmationDialogHandlerService } from "app/shared/components/confirmation-dialog/confirmation-dialog-handler.service";
import { API } from "app/shared/constants/endpoints";
import { ApiHandlerService } from "app/shared/services/api-handler.service";
import { ToasterService } from "app/shared/services/toaster.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TimeoutError } from "rxjs";

@Component({
  selector: "app-product-basic-information",
  templateUrl: "./product-basic-information.component.html",
  styleUrls: ["./product-basic-information.component.css"],
  providers: [ConfirmationDialogHandlerService],
})
export class ProductBasicInformationComponent implements OnInit {
  @Output() data: EventEmitter<any> = new EventEmitter();
  @Output() variantEditData: EventEmitter<any> = new EventEmitter();
  @Input() stepper: MatStepper;
  categoryList;
  basicInfoForm: FormGroup;
  visibility = [
    { name: "Visible to All", value: "visible_to_all" },
    { name: "A", value: "A" },
    { name: "B", value: "B" },
    // { name: 'Customer Group C', value: 'C' },
    // { name: 'Customer Group D', value: 'D' }
  ];
  headerlist = [];
  trade_assurance = [];
  statusList: Array<any> = [
    { id: "active", title: "Active" },
    { id: "inactive", title: "Inactive" },
  ];
  clientList;
  partnerList;
  businessTypeList;
  variantId;
  editProductId;
  productAttributeList = [];
  attributeOptionList = [];
  previousProductAttributeList = [];
  attributeType = new FormControl("", Validators.required);
  attributeValue = new FormControl("", Validators.required);
  isUserProcessing = false;
  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private spinner: NgxSpinnerService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService
  ) { }

  ngOnInit(): void {
    this.getAllCategoryList();
    this.initForm();
    this.getAllClientList();
    this.getAllPartnerList();
    this.getAllBusinessTypeList();
    this.getTradeAssurance();
    this.getHeaderTag();
    this.getAllProductAttributeList();
    // console.log(this.activeRoute.snapshot.paramMap.get("id"));
    this.editProductId = this.activeRoute.snapshot.paramMap.get("id");
    if (this.editProductId) {
      this.getProductDetails();
    }
  }
  initForm() {
    this.basicInfoForm = this.fb.group({
      product_name: ["", Validators.required],
      product_description: ["", Validators.required],
      master_product_category_id: ["", Validators.required],
      user_group_visibility: ["",Validators.required],
      // product_url: [''],
      mrp_printed_on_box: [""],
      tax_applicable: [""],
      header_tags: [""],
      trade_assurance: [""],
      master_business_client_id: ["", Validators.required],
      master_business_partner_id: ["", Validators.required],
      master_business_type_id: ["", Validators.required],
      branding_possibilities: ["", Validators.required],
      product_service_type: ["", Validators.required],
      status: ["", Validators.required],
      moq_ready_stock: [10],
      moq_made_for_order: [10],
      moq_customisation_order: [10],
      moq_customised_box: [10],
    });
  }

  getProductDetails() {
    this.spinner.show();
    const url =
      API.CRM_ENDPOINTS.PRODUCT_DETAILS_NEW + "/" + this.editProductId;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        // console.log(result);
        this.variantEditData.emit(result.data);
        this.productAttributeList = result.data.attribute_values;
        if (this.productAttributeList.length > 0) {
          for (let i of this.productAttributeList) {
            this.previousProductAttributeList.push({
              master_product_attribute_id: i.master_product_attribute_id,
              attribute_value: [i.attribute_value],
            });
          }
        }
        this.basicInfoForm
          .get("product_name")
          .setValue(result.data.product_name);
        this.basicInfoForm
          .get("product_description")
          .setValue(result.data.product_description);
        this.basicInfoForm
          .get("master_product_category_id")
          .setValue(result.data.master_product_category_id);
        this.basicInfoForm
          .get("user_group_visibility")
          .setValue(result.data.user_group_visibility);
        this.basicInfoForm
          .get("mrp_printed_on_box")
          .setValue(result.data.mrp_printed_on_box);
        this.basicInfoForm
          .get("tax_applicable")
          .setValue(result.data.tax_applicable);
        this.basicInfoForm
          .get("master_business_client_id")
          .setValue(result.data.master_business_client_id);
        this.basicInfoForm
          .get("master_business_partner_id")
          .setValue(result.data.master_business_partner_id);
        this.basicInfoForm
          .get("master_business_type_id")
          .setValue(result.data.master_business_type_id);
        this.basicInfoForm
          .get("branding_possibilities")
          .setValue(result.data.branding_possibilities);
        this.basicInfoForm
          .get("product_service_type")
          .setValue(result.data.product_service_type);
        this.basicInfoForm.get("status").setValue(result.data.status);
        if (result.data.header_tags && result.data.header_tags.length > 0) {
          let list = [];
          for (let i of result.data.header_tags) {
            list.push(i.id.toString());
          }
          this.basicInfoForm.get("header_tags").setValue(list);
          // console.log(this.basicInfoForm.get("header_tags").value);
        } else {
          this.basicInfoForm
            .get("header_tags")
            .setValue(result.data.header_tags);
        }
        if (
          result.data.trade_assurance &&
          result.data.trade_assurance.length > 0
        ) {
          let list = [];
          for (let i of result.data.trade_assurance) {
            list.push(i.id.toString());
          }
          this.basicInfoForm.get("trade_assurance").setValue(list);
          // console.log(this.basicInfoForm.get("trade_assurance").value);
        } else {
          this.basicInfoForm
            .get("trade_assurance")
            .setValue(result.data.trade_assurance);
        }
        this.spinner.hide();
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
  getAllCategoryList() {
    const url = API.CRM_ENDPOINTS.CATEGORY_LIST;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 5000;
    pageObj["offset"] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          this.categoryList = resultData.rows;
          this.categoryList = this.categoryList.concat();
          // console.log(this.categoryList);
          
        } else {
          this.categoryList = [];
        }
      },

      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
    });
  }
  getAllClientList() {
    const url = API.CRM_ENDPOINTS.CLIENT_LIST;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 5000;
    pageObj["offset"] = 0;
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

      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
    });
  }

  //get client list

  getAllPartnerList() {
    const url = API.CRM_ENDPOINTS.PARTNER_LIST;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 5000;
    pageObj["offset"] = 0;
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

      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
    });
  }

  //get client list

  getAllBusinessTypeList() {
    const url = API.CRM_ENDPOINTS.BUSINESSTYPE_LIST;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 5000;
    pageObj["offset"] = 0;
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

      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
    });
  }
  getHeaderTag() {
    const url = API.CRM_ENDPOINTS.HEADER_TAG;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 5000;
    pageObj["offset"] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        // console.log(result.data);
        let resultData = result.data;
        if (resultData && resultData.length) {
          this.headerlist = resultData;
        } else {
          this.headerlist = [];
        }
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
    });
  }
  getTradeAssurance() {
    const url = API.CRM_ENDPOINTS.TRADE_ASSURANCE;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 5000;
    pageObj["offset"] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        // console.log(result.data);
        let resultData = result.data;
        if (resultData && resultData.length) {
          this.trade_assurance = resultData;
        } else {
          this.trade_assurance = [];
        }
      },
      error: (err) => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error("", "Timeout Error");
        }
      },
    });
  }
  checkForNext() {
    // alert("save method callled");
    console.log(this.basicInfoForm.value);
    if (this.basicInfoForm.invalid) return;
    let url;
    if (this.editProductId) {
      url = API.CRM_ENDPOINTS.PRODUCT_UPDATE_NEW + "/" + this.editProductId;
    } else {
      url = API.CRM_ENDPOINTS.PRODUCT_ADD_NEW;
    }

    let req = this.basicInfoForm.value;
    for (let i in req) {
      if (req[i] == "" || req[i] == null || req[i] == undefined) {
        delete req[i];
      }
    }
    // console.log(req);

    if (req.header_tags) {
      req.header_tags = req.header_tags.toString();
    }
    if (req.trade_assurance) {
      req.trade_assurance = req.trade_assurance.toString();
    }
    this.spinner.show();
    this.apiHandlerService.apiPost(url, req, {}).subscribe({
      next: (data) => {
        // console.log(data);

        if (this.editProductId) {
          this.variantId = this.editProductId;
        } else {
          this.variantId = data.data.id;
        }
        this.spinner.hide();
        this.data.emit(this.variantId);
        if (data.success) {
          this.toasterService.Success(data.message);
          this.isUserProcessing = !this.isUserProcessing;
          // this.stepper.next();
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
        this.toasterService.Error(err);
        this.spinner.hide();
        // console.log(err);
      },
    });
    /* this.data.emit(this.basicInfoForm.value);
    
    */
  }

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
  addAttribute(index) {
    if (this.attributeType.invalid) {
      this.toasterService.Error("", "Invalid Attribute Type");
      return;
    }
    if (this.attributeValue.invalid) {
      this.toasterService.Error("", "Invalid Attribute Value");
      return;
    }
    let ar = this.previousProductAttributeList.concat([
      {
        master_product_attribute_id: this.attributeType.value,
        attribute_value: [this.attributeValue.value],
      },
    ]);

    let req = {
      attribute_list: ar,
    };
    // console.log(req);
    this.isUserProcessing = true;
    let url;
    url = API.CRM_ENDPOINTS.ADDATTRIBUTE_PRODUCT + "/" + this.editProductId;
    this.apiHandlerService.apiPost(url, req, {}).subscribe({
      next: (data) => {
        // console.log(data);
        this.attributeType.reset();
        this.attributeValue.reset();
        if (data.success) {
          this.isUserProcessing = false;
          this.getAllAttributeValueList();
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

  getAllAttributeValueList() {
    let url;
    url =
      API.CRM_ENDPOINTS.ADDATTRIBUTEVALUE_PRODUCT + "/" + this.editProductId;
    let pageObj = {
      search_text: "",
    };
    pageObj["limit"] = 100;
    pageObj["offset"] = 0;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData.rows && resultData.rows.length) {
          // console.log(resultData.rows);
          this.productAttributeList = [];
          this.productAttributeList = resultData.rows;
          this.previousProductAttributeList = [];
          for (let i of resultData.rows) {
            this.previousProductAttributeList.push({
              master_product_attribute_id: i.id,
              attribute_value: [i.attribute_values[0].attribute_value],
            });
          }
          // this.variantAttributeList[index][0]=resultData.rows;
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

  deleteAttribute(index, id) {
    // console.log(id);
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
                this.productAttributeList.splice(index, 1);
                this.previousProductAttributeList.splice(index, 1);
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
}

/*
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
*/
