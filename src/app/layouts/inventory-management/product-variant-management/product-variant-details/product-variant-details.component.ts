import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Observable, TimeoutError } from 'rxjs';
import { API } from 'app/shared/constants/endpoints';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
@Component({
  selector: 'app-product-variant-details',
  templateUrl: './product-variant-details.component.html',
  styleUrls: ['./product-variant-details.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class ProductVariantDetailsComponent implements OnInit {

  variantData: any;
  new_status: string;
  loading: boolean
  sortByStatusObject: any;
  sortByUserTypeObject: any;
  queryObject: any;
  userService: any;
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  productId;
  variantId;
  constructor(
    private router: Router,
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,
    public activeRoute: ActivatedRoute,
  ) {
    this.sortByStatusObject = [
      {
        key: 'active', value: 'Active'
      },
      {
        key: 'inactive', value: 'Inactive'
      }
    ];
    this.sortByUserTypeObject = [
      {
        key: 'service_provider', value: 'Service Provider'
      },
      {
        key: 'customer', value: 'Customer'
      }
    ];
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.productId = params['id'];
      this.variantId = params['vid'];
      this.getProductVariantDetails();
      this.listOfTags()
    });
  }
  setAttributeData(){
    let data = {
      type:'Variant',
      id:this.variantId,
      pid:this.productId
    }
    localStorage.setItem('setAttributeData',JSON.stringify(data));
  }
  deleteProduct(id: string,productName:string) {
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete \'' + productName + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (result) {
        let url = API.CRM_ENDPOINTS.PRODUCT_DELETE + '/' + id;
          this.isListLoading = false;
          this.apiHandlerService.apiPost(url, null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                this.router.navigate(['/crm/inventory-management/product-management']);
              } else {
                this.toasterService.Error();
              }
            },
            err => {
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
              }
              this.isListLoading = false;
              this.isStatusBtnEnabled = true;
            }
          );
      }
    });
  }

  getProductVariantDetails() {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.PRODUCTVARIANT_DETAILS + '/' + this.productId + '/' + this.variantId;
      this.apiHandlerService.apiGet(url).subscribe({
        next: (result: any) => {
          this.variantData = result.data;
          this.isListLoading = false;
        },
        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
          this.isListLoading = false;
        },
        complete: () => {
          this.isStatusBtnEnabled = true;
        }
      });
    }
  }

  // Add tag to products


    visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagesCtrl = new FormControl();
  filteredtagess: Observable<string[]>;
  tagess: {tage: string,id:number}[] = [];
  alltagess: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  remaingTags  : number
  more : boolean = false;
  @ViewChild('tagesInput') tagesInput: ElementRef<HTMLInputElement>;
 

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tages
    if ((value || '').trim()) {
      this.addTagsApi(value);
     
    }


    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagesCtrl.setValue(null);
  }

  remove(tages): void {
    
    
    const api = API.CRM_ENDPOINTS.DELETE_PRODUCT_TAG(tages.id);
    this.apiHandlerService.apiPost(api,{}).subscribe({
         next: (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                this.listOfTags()
              } else {
                this.toasterService.Error();
              }
            },
    error:   err => {
      console.log(err);
      
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
              }
              this.isListLoading = false;
              this.isStatusBtnEnabled = true;
            }
    })
  }

  listOfTags(limit = 10){

    limit = this.more ? this.remaingTags +10 : 10;

     const api = `${API.CRM_ENDPOINTS.GET_PRODUCT_TAG}?offset=0&limit=${limit}&product_variant_id=${this.variantId}`;
    
     
     

     this.apiHandlerService.apiGet(api).subscribe({
       next: (result: any) => {
        

        this.remaingTags = result.data.total >  10 ? result.data.total - 10 : 0;
       
        this.tagess = result.data.rows.map(row => { return {tag: row.tag_name , id : row.id}})
        
       },
       error:err => {
         console.log(err);
         
       }
     })
  }

 
  addTagsApi(tag){
    const api = API.CRM_ENDPOINTS.ADD_PRODUCT_TAG;

    this.apiHandlerService.apiPost(api,{product_variant_id:this.variantId,tag_name:tag}).subscribe({

     next: (result: any) => {
              if (result.success === true) {
                this.listOfTags()
                this.toasterService.Success(result.message);
              } else {
                this.toasterService.Error();
              }
            },
    error:   err => {
              if (err instanceof TimeoutError) {
                this.toasterService.Error('', 'Timeout Error');
              }
              this.isListLoading = false;
              this.isStatusBtnEnabled = true;
            }

    })
  }

  

}
