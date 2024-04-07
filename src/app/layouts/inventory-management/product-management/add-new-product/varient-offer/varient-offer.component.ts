import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, TimeoutError } from 'rxjs';
@Component({
  selector: 'app-varient-offer',
  templateUrl: './varient-offer.component.html',
  styleUrls: ['./varient-offer.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class VarientOfferComponent implements OnInit, OnChanges, OnDestroy {
  @Input() stepper: MatStepper;
  @Input() variantLength;
  @Input() variantIdList;
  @Input() variantOffer;
  @Input() variantAddUpdate;
  variantLead: FormGroup;
  variantid = [{ id: '1174', name: 'Variant 1' }, { id: '1178', name: 'Variant 2' }];
  varientleadArray = [];
  onchangeStatus = false;
  editProductId;
  currenlength = 0;
  maxprice: any;
  constructor(private fb: FormBuilder, public toasterService: ToasterService,
    public apiHandlerService: ApiHandlerService, private activeRoute: ActivatedRoute,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService, private spinner: NgxSpinnerService) { }
  ngOnDestroy(): void {
    sessionStorage.removeItem('stepperIndex');
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.variantIdList);
    this.editProductId = this.activeRoute.snapshot.paramMap.get('id');
    if (this.onchangeStatus && !this.editProductId) {
      let variantArray = this.variantLead.get('vriantLeadArray') as FormArray;
      variantArray.clear();
      for (let i = 0; i < this.variantIdList.length; i++) {
        variantArray.push(this.getLeadGroup());
      }
    }
    // console.log(this.variantOffer);
    if (this.onchangeStatus && this.editProductId && this.variantAddUpdate) {
      let variantArray = this.variantLead.get('vriantLeadArray') as FormArray;
      if (this.variantAddUpdate.type == 'add') {
        // console.log(this.currenlength);
        // console.log(this.variantIdList.length);

        for (let i = this.currenlength; i < this.variantIdList.length; i++) {
          variantArray.push(this.getLeadGroup());
        }
        this.currenlength = this.variantIdList.length;
      }
      else if (this.variantAddUpdate.type == 'delete') {
        //  console.log('delete');
        variantArray.removeAt(this.variantAddUpdate.index);
        this.currenlength--;
      }
    }

    if (this.variantOffer.length > 0 && this.onchangeStatus && this.editProductId && !this.variantAddUpdate) {
      // console.log('catch variant data');

      if (this.editProductId) {
        let variantArray = this.variantLead.get('vriantLeadArray') as FormArray;
        this.currenlength = this.variantOffer.length;
        variantArray.clear();
        this.variantIdList = [];
        for (let i = 0; i < this.variantOffer.length; i++) {
          variantArray.push(this.fb.group({
            variantGroup: this.fb.array([])
          }));
          this.variantIdList.push({ variant_id: this.variantOffer[i].variant_id, title: this.variantOffer[i].variant_name });
          //variantArray.controls[i].patchValue(this.variantOffer[i].lead);
          let variantGroup = variantArray.controls[i].get('variantGroup') as FormArray;
          for (let j of this.variantOffer[i].offer) {
            variantGroup.push(this.fb.group({
              id: [j.id],
              min_quantity: [j.min_quantity, Validators.required],
              max_quantity: [j.max_quantity, Validators.required],
              offer_price: [j.offer_price, Validators.required],
              // actual_price: [j.actual_price, Validators.required],
              max_offer_price: [j.max_offer_price]
              

            }));
            console.log();


          }

        }
      }
    }

  }

  ngOnInit(): void {
    if (sessionStorage.getItem('stepperIndex')) {
      this.stepper.selectedIndex = parseInt(sessionStorage.getItem('stepperIndex'));
      sessionStorage.removeItem('stepperIndex');
    }

    this.initForm();
    let variantArray = this.variantLead.get('vriantLeadArray') as FormArray;
    for (let i = 0; i < this.variantLength; i++) {
      variantArray.push(this.getLeadGroup());
    }
    this.onchangeStatus = true;
  }
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    // console.log("Processing beforeunload...");
    sessionStorage.setItem('stepperIndex', this.stepper.selectedIndex.toString());
    //event.returnValue = false;
  }


  initForm() {
    this.variantLead = this.fb.group({
      vriantLeadArray: this.fb.array([

      ])
    })
    //  console.log(this.variantLead);
  }
  getLeadGroup() {
    return this.fb.group({
      variantGroup: this.fb.array([this.getLeadControl()])
    })
  }
  getLeadControl() {
    return this.fb.group({
      id: [null],
      min_quantity: ['', Validators.required],
      max_quantity: ['', Validators.required],
      offer_price: ['', Validators.required],
      // actual_price: ['', Validators.required],
      max_offer_price: ['']
    })
  }
  addSuplyCapcity(index) {

    let variantArray = this.variantLead.get('vriantLeadArray') as FormArray;
    let variantGroup = variantArray.controls[index].get('variantGroup') as FormArray;
    if (variantGroup.length < 4) {
      variantGroup.push(this.getLeadControl());
    }
    else {
      this.toasterService.Error('', 'We do not add more than 4 Offer');
    }

  }
  deleteSupplyCapcity(index, j) {

    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete ?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      // console.log(result);
      if (result) {
        this.spinner.show();
        let variantArray = this.variantLead.get('vriantLeadArray') as FormArray;
        let variantGroup = variantArray.controls[index].get('variantGroup') as FormArray;
        if (this.editProductId && variantGroup.controls[j].get('id').value) {
          let url = API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_OFFER_DELETE + '/' + variantGroup.controls[j].get('id').value;
          this.apiHandlerService.apiPost(url, null).subscribe(
            (result: any) => {
              this.spinner.hide();
              if (result.success === true) {
                this.toasterService.Success(result.message);
                variantGroup.removeAt(j);
              } else {
                this.toasterService.Error();
              }
            },
            err => {
              this.spinner.hide();
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
              }

            }
          );
        }
        else {
          variantGroup.removeAt(j);
          this.spinner.hide();
        }
      }


    });

  }
  submit() {
    // console.log(this.variantLead);
    if (this.variantLead.invalid) {
      this.variantLead.markAllAsTouched();
      this.toasterService.Error("Invalid Offer");
      return;
    }
    //for(let i of this.variantLead.value.vriantLeadArray)
    for (let i = 0; i < this.variantLead.value.vriantLeadArray.length; i++) {
      //  console.log("run");
      for (let j of this.variantLead.value.vriantLeadArray[i].variantGroup) {
        // console.log(j);     
        let obj = Object.assign({}, j, { product_variant_id: this.variantIdList[i]?.variant_id })
        this.varientleadArray.push(obj);
      }
    }
    console.log(this.varientleadArray);
    //stepper.next()
    this.saveLead();
  }

  saveLead() {
    /* if(index>this.varientleadArray.length-1){f
       this.stepper.next();
       return;
     }
     */

    // this.spinner.show();
    let url = this.editProductId ? API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_OFFER_UPDATE : API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_OFFER;
    this.apiHandlerService.apiPost(url, this.varientleadArray, {}).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (data.success) {
          this.maxprice = data.data;
          // console.log(this.maxprice);
          window.location.reload();
           this.spinner.show();
           localStorage.setItem('maxprice', JSON.stringify(this.maxprice));
           this.spinner.show();
          this.toasterService.Success(data.message);
          // index++;
          //this.stepper.next();
          // this.saveLead(index);
        }
        else {
          if (data.error && data.error.message) {
            this.toasterService.Error(data.error.message);
          } else if (data.error && (data.error.length > 0)) {
            data.error.forEach(erroObj => {
              this.toasterService.Error(erroObj.msg);
            });
          } else {
            this.toasterService.Error('Something went wrong.');
          }
          //index++;
          //this.saveLead(index);
        }
      },
      error: (err) => {
        this.spinner.hide();
        if (typeof err == 'string') {
          this.toasterService.Error(err);
        } else if (err.error && err.error.message) {
          this.toasterService.Error(err.error.message);
        }
        // index++;
        // this.saveLead(index);
      },
      complete: () => {
        this.spinner.hide();
      }
    });

    // this.apiHandlerService.apiPost(url,this.varientleadArray).subscribe((res)=>{
    //     // console.log(res.data);
    //     //  console.log(res.data[0].max_offer_price);
    //      this.maxprice = res.data;
    //      console.log(this.maxprice);

    //    }, error =>{
    //       console.log(error);
    //    })     
  }

}
