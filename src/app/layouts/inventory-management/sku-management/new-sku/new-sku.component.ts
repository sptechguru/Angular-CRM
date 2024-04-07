import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { StokeUpdateDialogHandlerService } from 'app/shared/components/stockupdate-dialog/stockupdate-dialog-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
declare var $: any;
@Component({
  selector: 'app-new-sku',
  templateUrl: './new-sku.component.html',
  styleUrls: ['./new-sku.component.css'],
  providers: [StokeUpdateDialogHandlerService],
  // host: {
  //   '(document:keypress)': 'changevalue($event)',changevaluesample($event)',

  // }
})
export class NewSkuComponent implements OnInit {
  addnewsku: FormGroup;
  modelstock: FormGroup;
  @Input() productname;
  sku;
  adjustment;
  reserve_stock;
  values;
  product: any = [];
  responsedata: any;
  showresponse: boolean = false;
  productid: any;
  reason: any;
  description: any;
  adjustment_history: any = [];
  totalQueryableData: any;
  readystock: any;
  public isUserProcessing: boolean = false;
  pageSize: number = 10;
  page: number;
  offset: any;
  queryObject: any;
  variantid: any = 0;
  samplestock: any = "";
  optionvalues: any;
  adjustment_reason: any = ""
  mquantity: any
  msamplestock: any
  mrstock: any;
  result: any;

  public isListLoading: boolean = false;

  constructor(
    public fb: FormBuilder,
    public mbs: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private activatedRoute: ActivatedRoute,
    private _localStorage: StorageAccessorService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public StokeUpdateDialogHandlerService: StokeUpdateDialogHandlerService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productid = this.activatedRoute.snapshot.params.productid;
    // console.log(this.productid);
    this.initformgroup();
  }
  initformgroup() {

    this.addnewsku = this.fb.group({
      sku_code: ['', Validators.required],
      adjustment: ['', Validators.required],
      adjustment_reasone: ['', Validators.required],
      adjustment_description: [''],
      reserve_stock: ['', Validators.required],
      sampleadjustment: ['', Validators.required],
      quantity: ['', Validators.required],
      ready_stock: [''],
      result_adj: [''],
      result_sample: [''],
      result_rstock: [''],
      rstock: [''],


    })
    this.queryObject = JSON.parse(this._localStorage.getPage.productManagement);
    let url = API.CRM_ENDPOINTS.Product_by_ID + "/" + this.productid;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        // console.log(result);
        if (result.success) {
          this.responsedata = result.data;
          if (this.responsedata) {
            // this.adjustment_history=(this.responsedata.product_variants[0].adjustment_histories) ? this.responsedata.product_variants[0].adjustment_histories :[] ;
            //  this.readystock = this.responsedata.quantity - this.responsedata.reserve_stock
            this.addnewsku.get('sku_code').setValue(this.responsedata.sku_code);
            this.addnewsku.get('ready_stock').setValue(this.responsedata.ready_stock);
            this.addnewsku.get('reserve_stock').setValue(this.responsedata.reserve_stock);

            this.variantid = this.responsedata.id;
            this.samplestock = (this.responsedata.sample_stock != null) ? this.responsedata.sample_stock : 0;
            this.getdata(this.queryObject);
          }
        }
        else {
          this.toasterService.Error = result.error;
        }

      }
    })

  }


  //   openmodel(rstock,quantity,sstock) { 
  //     //debugger
  //     this.mquantity=quantity;
  //     this.msamplestock=sstock;
  //     this.mrstock=rstock;
  //     $("#myModal").modal('show');
  //     $("#myModal").appendTo("body");
  //     console.log(this.mquantity,this.msamplestock,this.mrstock)

  //   }
  //   closemodel() {
  //     this.mquantity='';
  //     this.msamplestock='';
  //     this.mrstock='';  
  //    $("#myModal").on("hidden.bs.modal", function() {
  //       $(this).removeData("bs.modal");
  // });
  //     $("#myModal").modal('hide');

  //   }
  openmodel(rstock, quantity, sstock) {
    this.mquantity = quantity;
    this.msamplestock = sstock;
    this.mrstock = rstock;
    this.StokeUpdateDialogHandlerService.openDialog({
      quantity: this.mquantity,
      sstock: this.msamplestock,
      rstock: this.mrstock,
    }).subscribe((result) => {
      if (!result) return
      this.onSubmit(result)
    })
  }

  onSubmit(result) {
    if (!this.isUserProcessing) {
      let nrstock, nadjustment, nsstock;
      this.isUserProcessing = true;
      if (result.rstock >= 0) {
        nrstock = result.rstock;
      } else {
        nrstock = this.addnewsku.get('reserve_stock').value;
      }
      if (result.adjustment) {
        nadjustment = result.adjustment

      } else {
        nadjustment = 0;
      }
      if (result.sstock) {
        nsstock = result.sstock
      } else {
        nsstock = 0
      }
      let payload = {
        "sku_code": this.addnewsku.get('sku_code').value,
        "adjustment": nadjustment,
        "reserve_stock": nrstock,
        "adjustment_reasone": result.adjustment_reason,
        "adjustment_description": result.adjustment_description,
        "sample_stock": nsstock
      }
      this.product.push(payload);
      let url = API.CRM_ENDPOINTS.SKU_BULK_UPDATE;
      this.apiHandlerService.apiPost(url, this.product, {}).subscribe({
        next: (data) => {

          if (data.success) {
            // this.addnewsku.untouched="";
            this.isUserProcessing = false;
            //  this.responsedata=data.data[0]; 

            this.product = [];

            //  this.clearInputMet

            this.toasterService.Success(data.message);
            setTimeout(() => {
              $("#myModal").modal('hide');

            }, 5000);
          } else {
            this.isUserProcessing = false;
            if (data.error && data.error.message) {
              this.toasterService.Error(data.error.message);
              this.product = [];


            } else if (data.error && (data.error.length > 0)) {
              data.error.forEach(erroObj => {
                this.toasterService.Error(erroObj.msg);

              });
            } else {
              this.toasterService.Error('Something went wrong.');
            }
          }
          setTimeout(() => {
            this.initformgroup();
          }, 5000);
        },
        error: (err) => {
          this.isUserProcessing = false;
          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        }
      })
    }
  }
  clearInputMethod() {
    //this.addnewsku.controls.sku_code.reset(); 
    this.addnewsku.controls.adjustment.reset();

  }
  handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      this.getdata(this.queryObject);
    }
  }
  getdata(queryObject) {
    const url = API.CRM_ENDPOINTS.Product_quantity_adjustment + '/' + this.variantid;
    const limit = this.pageSize || 10;
    let pageObj = {};
    pageObj['limit'] = limit;
    pageObj['offset'] = (this.queryObject.page - 1) * limit;
    this.offset = (this.queryObject.page - 1) * limit;
    this.apiHandlerService.apiGet(url, pageObj).subscribe({
      next: (result: any) => {
        this.adjustment_history = result.data["rows"];
        this.totalQueryableData = result.data["total"];

      }
    })
    // this.initformgroup();
  }
}
