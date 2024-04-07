import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, TimeoutError } from 'rxjs';

@Component({
  selector: 'app-varient-lead',
  templateUrl: './varient-lead.component.html',
  styleUrls: ['./varient-lead.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class VarientLeadComponent implements OnInit,OnChanges {
  @Input() stepper: MatStepper;
  @Input() variantLength;
  @Input() variantIdList;
  @Input() variantLeadList;
  @Input() variantAddUpdate;
  editProductId;
  variantLead:FormGroup;
  variantid=[{id:'1174',name:'Variant 1'},{id:'1178',name:'Variant 2'}];
  varientleadArray=[];
  onchangeStatus=false;
  currenlength=0;
  constructor(private fb:FormBuilder, public toasterService: ToasterService,
    public apiHandlerService: ApiHandlerService,private activeRoute:ActivatedRoute,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService,private spinner: NgxSpinnerService) { }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.variantIdList);
    this.editProductId=this.activeRoute.snapshot.paramMap.get('id');
   
   if(this.onchangeStatus &&  !this.editProductId){
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray; 
    variantArray.clear();
    for(let i=0;i<this.variantIdList.length;i++){
      variantArray.push(this.getLeadGroup());
    }
   }
   
  //  console.log(this.variantAddUpdate);
   if(this.onchangeStatus && this.editProductId && this.variantAddUpdate){
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
     if(this.variantAddUpdate.type=='add'){
      //  console.log(this.currenlength);
      //  console.log(this.variantIdList.length);

      for(let i=this.currenlength;i<this.variantIdList.length;i++){
        variantArray.push(this.getLeadGroup());    
      } 
       this.currenlength=this.variantIdList.length;
     }
     else if(this.variantAddUpdate.type=='delete'){
       console.log('delete');
      variantArray.removeAt(this.variantAddUpdate.index);
      this.currenlength--;
     }
   }
   
  //  console.log(this.variantLeadList);
   if(this.variantLeadList.length > 0 && this.onchangeStatus &&  this.editProductId && !this.variantAddUpdate){
    // console.log('catch variant data');
    this.currenlength=this.variantLeadList.length;
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
    if(this.editProductId){
      variantArray.clear();
      this.variantIdList=[];
   for(let i=0;i<this.variantLeadList.length;i++){
     variantArray.push(this.fb.group({
      variantGroup:this.fb.array([])
    }));
     this.variantIdList.push({variant_id:this.variantLeadList[i].variant_id,title:this.variantLeadList[i].variant_name});
     //variantArray.controls[i].patchValue(this.variantLeadList[i].lead);
     let variantGroup=variantArray.controls[i].get('variantGroup') as FormArray;
      for(let j of this.variantLeadList[i].lead){
        variantGroup.push(this.fb.group({
          id:[j.id],
          min_quantity:[j.min_quantity,Validators.required],
          max_quantity:[j.max_quantity,Validators.required],
          min_eta:[j.min_eta,Validators.required],
          max_eta:[j.max_eta,Validators.required]
         }));
      } 
     
   }
    }
 }

  }

  ngOnInit(): void {
    this.initForm();
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
    for(let i=0;i<this.variantLength;i++){
      variantArray.push(this.getLeadGroup());
    }
    this.onchangeStatus=true;
  }

  initForm(){
   this.variantLead=this.fb.group({
     vriantLeadArray:this.fb.array([
      
     ])
   })
  //  console.log(this.variantLead);
  }
  getLeadGroup(){
   return this.fb.group({
     variantGroup:this.fb.array([this.getLeadControl()])
   })
  }
  getLeadControl(){
   return this.fb.group({
    id:[null],
    min_quantity:['',Validators.required],
    max_quantity:['',Validators.required],
    min_eta:['',Validators.required],
    max_eta:['',Validators.required]
   })
  }
  addSuplyCapcity(index){
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
    let variantGroup=variantArray.controls[index].get('variantGroup') as FormArray;
    if(variantGroup.length < 4){
      variantGroup.push(this.getLeadControl());
    }
    else{
      this.toasterService.Error('', 'We do not add more than 4 Lead');
    }
  }
  deleteSupplyCapcity(index,j){
     
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete ?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      // console.log(result);
      if(result){
        this.spinner.show();
      let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
      let variantGroup=variantArray.controls[index].get('variantGroup') as FormArray;
      // console.log(variantGroup.controls[j].get('id').value);
      if(this.editProductId && variantGroup.controls[j].get('id').value){
        // console.log("inside delete block");
        let url = API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_LEAD_DELETE + '/' + variantGroup.controls[j].get('id').value;
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
      else{
        variantGroup.removeAt(j);
        this.spinner.hide();
      }
      }
      
    
    });
    
    
  }
  submit(){
    if(this.variantLead.invalid){
      this.variantLead.markAllAsTouched();
      this.toasterService.Error("Invalid lead");
      return ;
    }
    
    // console.log(this.variantLead);
    
    //for(let i of this.variantLead.value.vriantLeadArray)
    for(let i=0;i<this.variantLead.value.vriantLeadArray.length;i++){
      //  console.log("run");
       for(let j of this.variantLead.value.vriantLeadArray[i].variantGroup){
        let obj={}
      //  console.log(this.variantIdList[i]);
         obj=Object.assign({},{"product_variant_id":this.variantIdList[i].variant_id},j);
         if(obj !=undefined && obj!=null)
         this.varientleadArray.push(obj);
         
       }
       
    }
    
    // console.log(this.varientleadArray);
    //stepper.next()
    this.saveLead();
  }
  saveLead(){
   /* if(index>this.varientleadArray.length-1){
      this.stepper.next();
      return;
    }
    */
    this.spinner.show();
    let url = this.editProductId ? API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_LEAD_UPDATE : API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_LEAD;
    this.apiHandlerService.apiPost(url,this.varientleadArray,{}).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (data.success) {
          // console.log(data);
          this.toasterService.Success(data.message);
          //this.stepper.next();
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
        this.spinner.hide();
        if (typeof err == 'string') {
          this.toasterService.Error(err);
        } else if (err.error && err.error.message) {
          this.toasterService.Error(err.error.message);
        }
        
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
}
