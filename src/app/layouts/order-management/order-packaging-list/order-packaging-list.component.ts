import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-order-packaging-list',
  templateUrl: './order-packaging-list.component.html',
  styleUrls: ['./order-packaging-list.component.css'],
  providers: [ConfirmationDialogHandlerService]
})

export class OrderPackagingListComponent implements OnInit {
  orderID: any;
  shipmentID: any;
  isPackagingListProcessing: boolean = false;
  isStatusBtnEnabled: boolean = false;
  packaging_list: any = [];
  model = {

  };

  title = 'FormArray Example in Angular Reactive forms';

  packagingsForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService
  ) {

    this.packagingsForm = this.fb.group({
      packagings: this.fb.array([]),
    });

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderID = params.get('id');
      this.shipmentID = params.get('sid');
    });


    this.addItem();
  }

  get packagings(): FormArray {
    return this.packagingsForm.get("packagings") as FormArray
  }

  newItem(): FormGroup {
    return this.fb.group({
      model_number: ['', [Validators.required]],
      product_name: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      length: ['', [Validators.required]],
      width: ['', [Validators.required]],
      height: ['', [Validators.required]],
      cartoon_net_weight: ['', [Validators.required]],
      cartoon_gross_weight: ['', [Validators.required]],
      total_cartoon: ['', [Validators.required]],
      overall_net_weight: ['', [Validators.required]],
      overall_gross_weight: ['', [Validators.required]],
      cubic_metre: ['', [Validators.required]],
    })
  }

  addItem() {
    this.packagings.push(this.newItem());
  }

  removeItem(i: number) {
    if (this.packagings.length > 1) {
      this.packagings.removeAt(i);
    }
  }

  changeDimension(i) {
    let packaging_list = this.packagings.controls;
    let length = packaging_list[i]['controls'].length.value;
    let width = packaging_list[i]['controls'].width.value;
    let height = packaging_list[i]['controls'].height.value;
    let total_cartoon = packaging_list[i]['controls'].total_cartoon.value;
    if (length && width && height && total_cartoon) {
      let cubic_metre = ((length / 100) * (width / 100) * (height / 100)) * total_cartoon;
      packaging_list[i]['controls'].cubic_metre.setValue(cubic_metre.toFixed(2));
    }
  }

  createCalculations(i) {
    let packaging_list = this.packagings.controls;
    let length = packaging_list[i]['controls'].length.value;
    let width = packaging_list[i]['controls'].width.value;
    let height = packaging_list[i]['controls'].height.value;
    let total_cartoon = packaging_list[i]['controls'].total_cartoon.value;
    let overall_gross_weight = packaging_list[i]['controls'].overall_gross_weight.value;
    if (length && width && height && total_cartoon) {
      let cubic_metre = ((length / 100) * (width / 100) * (height / 100)) * total_cartoon;
      packaging_list[i]['controls'].cubic_metre.setValue(cubic_metre.toFixed(3));
    }
    if (total_cartoon && overall_gross_weight) {
      let overall_net_weight = overall_gross_weight - total_cartoon;
      let cartoon_gross_weight = overall_gross_weight / total_cartoon;
      packaging_list[i]['controls'].overall_net_weight.setValue(overall_net_weight.toFixed(2))
      packaging_list[i]['controls'].cartoon_gross_weight.setValue(cartoon_gross_weight.toFixed(2))
      if (total_cartoon && overall_net_weight) {
        let cartoon_net_weight = overall_net_weight / total_cartoon;
        packaging_list[i]['controls'].cartoon_net_weight.setValue(cartoon_net_weight.toFixed(2))
      }
    }
  }

  onSubmit() {
    if (this.packagingsForm.valid && !this.isPackagingListProcessing) {
      this.isPackagingListProcessing = true;
      let url = API.CRM_ENDPOINTS.CREATE_PACKAGING_LIST(this.orderID, this.shipmentID);
      let dataModel = {
        packaging_list: this.packagingsForm.value.packagings
      };
      this.apiHandlerService.apiPost(url, dataModel).subscribe({
        next: (response: any) => {
          this.isPackagingListProcessing = false;
          if (response.success) {
            this.toasterService.Success(response.message);
            this.router.navigate(['/crm/order-management']);
          }
          else {
            this.toasterService.Error(response.message);
          }
        },
        error: (err) => {
          this.isPackagingListProcessing = false;
          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        }

      })
    } else {
      this.toasterService.Error('Please fill empty fields.');
    }
  }

}