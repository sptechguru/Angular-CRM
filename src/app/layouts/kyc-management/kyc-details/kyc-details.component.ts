import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Location } from '@angular/common';
export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-view-user',
  templateUrl: './kyc-details.component.html',
  styleUrls: ['./kyc-details.component.css']
})
export class KycDetailsComponent implements OnInit {
 DialogData 
    animal: string;
    name: string;
  
  kycId: string;
  bussinessName : string;
  categoryName : any;
  categoryNameUpdate : string;

  updateId : any;
  categoryId : any;
  kycDetails: any = {};
  statusTypes: any = [
    { status: 'pending', label: 'Pending' },
    { status: 'approve', label: 'Approved' },
    { status: 'reject', label: 'Reject' }
  ];
  User_groupTypes: any = [
    { status: 'A', label: 'RESELLER' },
    { status: 'B', label: 'DIRECT' },
  ];
  isFormReady: boolean = false;
  pan_image: any;
  pan_ext: any;
  aadhar_image: any;
  aadhar_ext: any;
  gst_image: any;
  gst_ext: any;
  b_account_image: any;
  b_account_ext: any;
  b_tan_image: any;
  b_tan_ext: any;
  b_pan_image: any;
  b_pan_ext: any;

  isStatusProcessing: boolean = false;
  isStatusProcessings: boolean = false;
  isStatusProcessings_: boolean = false;

  kycStatusForm: FormGroup;
  reject_status: boolean = false;
  reject__status: boolean = false;
  reject_status_: boolean = false;

  initialFormData = {
    adhar_card_status: "approve",
    pan_card_status: "approve",
    gst_status: "approve",
    current_account_check_status: "approve",
    business_tan_reg_cert_status: "approve",
    business_pan_card_status: "approve",
    reject_reason: "",
    user_group : "",
    gst_no : new FormControl('', [Validators.required]),
    unamePattern :"^[a-zA-Z ]([a-zA-Z.])+$"
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private _location: Location,
    private dialog : MatDialog
  ) {
    this.kycId = this.route.snapshot.paramMap.get('id');
    this.bussinessName = this.route.snapshot.paramMap.get('name');
    this.updateId = this.route.snapshot.paramMap.get('update');
    this.categoryName = this.route.snapshot.paramMap.get('user_group');
    this.categoryId = this.route.snapshot.paramMap.get('userid')
    
  }
  

  ngOnInit(): void {
    this.getKycDetails();
  }

//   backClicked() :any
// {
//   window.history.back();
 
// }

  updateName(): void{
    this.reject_status = false;
    this.isStatusProcessings = true;
      let url =
        API.CRM_ENDPOINTS.UPDATE_BUSINESS_NAME + "/" + this.updateId + "/" + this.bussinessName;
      this.apiHandlerService
        .apiPost(url, {}, { contentType: { isFormDataContent: false } })
        .subscribe({
          next: (data) => {
            if (data.success) {
              // let msg = (data.message) ? data.message : 'Business Name updated successfully.';
              let msg = 'Business Name updated successfully.';

              this.toasterService.Success(msg);
              this.isStatusProcessings = false;
              // this.router.navigate(['/crm/users-management'])
             
            } else {
            this.toasterService.Error(data.message);
            }
          },
          error: (err) => {
            let msg;
            if (err && err.error && err.error.message) {
              msg = err.error.message;
            } else if (err && err.message) {
              msg = err.message;
            }
            this.toasterService.Error(msg);
            this.isStatusProcessings = false;
          },
          complete: () => { 
            this.isStatusProcessings = false;
          },
        });
  }

  updateCategory(){
    this.reject_status = false;
    this.isStatusProcessings_ = true;
    
    if(this.categoryName == 'RESELLER'){
      this.categoryNameUpdate = 'A';
    }else{
    
      this.categoryNameUpdate = 'B';

    }
          let url =
            API.CRM_ENDPOINTS.UPDATE_CATEGORY_NAME + "/" + this.categoryId + "/" + this.bussinessName  ;
          this.apiHandlerService
            .apiPost(url, {user_group:this.categoryNameUpdate}, { contentType: { isFormDataContent: false } })
            .subscribe({
              next: (data) => {
                if (data.success) {
                  // let msg = (data.message) ? data.message : 'Category updated successfully.';
                  let msg = 'Category updated successfully.';

                  this.toasterService.Success(msg);
                  this.isStatusProcessings_= false;
                  // this.router.navigate(['/crm/users-management']);
                } else {
               this.toasterService.Error(data.message);
                }
              },
              error: (err) => {
                let msg;
                if (err && err.error && err.error.message) {
                  msg = err.error.message;
                } else if (err && err.message) {
                  msg = err.message;
                }
                this.toasterService.Error(msg);
                this.isStatusProcessings_ = false;
              },
              complete: () => { 
               this.getKycDetails();
              },
            });
      }

      openDialog() {
        const dialogRef = this.dialog.open(DialogElementsExampleDialog, {
          width: "360px",
          height:"160px",
          data: {name: this.name},
        });
    
        dialogRef.afterClosed().subscribe((result) => {
          if(result == 'yes'){
            this.updateCategory();
          }
        });
      }
    

  getKycDetails() {
    this.apiHandlerService.apiGet(API.CRM_ENDPOINTS.KYC_DETAIL(this.kycId)).subscribe({
      next: (result) => {
        this.kycDetails = result.data;
        console.log(this.kycDetails);
        if(this.kycDetails) {
          if(this.kycDetails.pan_card){
            this.pan_image = this.kycDetails.pan_card;
            this.pan_ext = this.pan_image.split(/[\s.]+/).pop();
          }
          if(this.kycDetails.adhar_card){
            this.aadhar_image = this.kycDetails.adhar_card;
            this.aadhar_ext = this.aadhar_image.split(/[\s.]+/).pop();
          }
          if(this.kycDetails.gst){
            this.gst_image = this.kycDetails.gst;
            this.gst_ext = this.gst_image.split(/[\s.]+/).pop();
          }
          if(this.kycDetails.current_account_check){
            this.b_account_image = this.kycDetails.current_account_check;
            this.b_account_ext = this.b_account_image.split(/[\s.]+/).pop();
          }
          if(this.kycDetails.business_tan_reg_cert){
            this.b_tan_image = this.kycDetails.business_tan_reg_cert;
            this.b_tan_ext = this.b_tan_image.split(/[\s.]+/).pop();
          }
          if(this.kycDetails.business_pan_card){
            this.b_pan_image = this.kycDetails.business_pan_card;
            this.b_pan_ext = this.b_pan_image.split(/[\s.]+/).pop();
          }
          this.initialFormData.adhar_card_status = this.kycDetails.adhar_card_status
          this.initialFormData.pan_card_status = this.kycDetails.pan_card_status
          this.initialFormData.gst_status = this.kycDetails.gst_status
          this.initialFormData.current_account_check_status = this.kycDetails.current_account_check_status
          this.initialFormData.business_tan_reg_cert_status = this.kycDetails.business_tan_reg_cert_status
          this.initialFormData.business_pan_card_status = this.kycDetails.business_pan_card_status
          this.initialFormData.reject_reason = this.kycDetails.reject_reason
          this.initialFormData.gst_no = this.kycDetails.gst_no
        }
        this.createForm();
      },
      error: (err) => {
      },

    })
  }

  updateKyc(){
    {
      this.reject_status = false;
      this.isStatusProcessing = true;
      let formValues = this.kycStatusForm.value;
      // console.log("formValues",this.kycStatusForm.valid)
      this.apiHandlerService.apiPost(API.CRM_ENDPOINTS.UPDATE_KYC_ITEM_LIST(this.kycId), formValues).subscribe({
        next: (result) => {
          let msg = (result.message) ? result.message : 'KYC status updated successfully.';
          this.toasterService.Success(msg);
          this.isStatusProcessing = false;
          // this.router.navigate(['/crm/users-management']);
        },
        error: (err) => {
          let msg;
          if (err && err.error && err.error.message) {
            msg = err.error.message;
          } else if (err && err.message) {
            msg = err.message;
          }
          this.toasterService.Error(msg);
          this.isStatusProcessing = false;
        },
        complete: () => {
          this.isStatusProcessing = false;
        }
      });
    }
  }

  handleSubmit() {
    if(this.kycStatusForm.value.gst_status === 'reject'){
        this.businessNameUpdate();
      console.log("businessNameUpdate kyc callled.");

      this.toasterService.Error("Please enter reason of document rejection");
    }else{
      console.log("update kyc callled.");
      this.updateKyc();
    }
 
  }

  createForm() {
    this.kycStatusForm = this.fb.group({
      adhar_card_status: [
        this.initialFormData.adhar_card_status
      ],
      pan_card_status: [
        this.initialFormData.pan_card_status
      ],
      gst_status: [
        this.initialFormData.gst_status
      ],
      current_account_check_status: [
        this.initialFormData.current_account_check_status
      ],
      business_tan_reg_cert_status: [
        this.initialFormData.business_tan_reg_cert_status
      ],
      business_pan_card_status: [
        this.initialFormData.business_pan_card_status
      ],
      reject_reason: [
        this.initialFormData.reject_reason
      ],
      gst_no: [
        this.initialFormData.gst_no
      ],
    });
    this.isFormReady = true;
  }

  get adhar_card_status() {
    return this.kycStatusForm.get('adhar_card_status');
  }
  get pan_card_status() {
    return this.kycStatusForm.get('pan_card_status');
  }
  get gst_status() {
    return this.kycStatusForm.get('gst_status');
  }
  get current_account_check_status() {
    return this.kycStatusForm.get('current_account_check_status');
  }
  get business_tan_reg_cert_status() {
    return this.kycStatusForm.get('business_tan_reg_cert_status');
  }
  get business_pan_card_status() {
    return this.kycStatusForm.get('business_pan_card_status');
  }

  get reject_reason() {
    return this.kycStatusForm.get('reject_reason');
  }
  get gst_no() {
    return this.kycStatusForm.get('gst_no');
  }
  businessNameUpdate() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialogs, {
      width: "250px",
      height:"250px",
      data: {name: this.name},
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.initialFormData.reject_reason = result;
      this.kycStatusForm.patchValue({
        reject_reason : result
      })
    
      // this.createForm();
      // this.updateKyc();
    });
  }
}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogOverviewExampleDialogs {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogs>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialogbox.html',
})
export class DialogElementsExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogElementsExampleDialog>,
  ) {}

onNoClick()
{
     this.dialogRef.close();
}
}

function backClicked() {
  throw new Error('Function not implemented.');
}

