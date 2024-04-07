import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-varient-image',
  templateUrl: './varient-image.component.html',
  styleUrls: ['./varient-image.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class VarientImageComponent implements OnInit,OnChanges {
  @Input() stepper:MatStepper;
  @Input() variantLength;
  @Input() variantIdList;
  @Input() variantImageList;
  @Input() variantAddUpdate;
  variantLead:FormGroup;
  variantid=[{id:'1174',name:'Variant 1'},{id:'1178',name:'Variant 2'}];
  varientleadArray=[];
  onchangeStatus=false;
  editProductId;
  imageIdList=[];
  currenlength=0;
  disable=false;
  isDefult = false;
   
  constructor(private fb:FormBuilder, public toasterService: ToasterService,
    public apiHandlerService: ApiHandlerService,private cdr:ChangeDetectorRef,
    private spinner: NgxSpinnerService,private activeRoute:ActivatedRoute,private router:Router,
    public confirmationDialogHandlerService: ConfirmationDialogHandlerService) { }
    ngOnChanges(): void {
      // console.log(this.variantIdList);
      this.editProductId=this.activeRoute.snapshot.paramMap.get('id');
      if(this.onchangeStatus && !this.editProductId){
       let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
       variantArray.clear();
       for(let i=0;i<this.variantIdList.length;i++){
         variantArray.push(this.getLeadGroup());
         this.imageIdList.push([])
       }
      }

      if(this.onchangeStatus && this.editProductId && this.variantAddUpdate){
        let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
         if(this.variantAddUpdate.type=='add'){
          // console.log(this.currenlength);
          // console.log(this.variantIdList.length);
   
         for(let i=this.currenlength;i<this.variantIdList.length;i++){
           variantArray.push(this.getLeadGroup());    
         } 
          this.currenlength=this.variantIdList.length;
         }
         else if(this.variantAddUpdate.type=='delete'){
          //  console.log('delete');
          variantArray.removeAt(this.variantAddUpdate.index);
          this.currenlength--;
         }
       }
      // console.log(this.variantImageList);
      if(this.variantImageList.length >0 && this.onchangeStatus &&  this.editProductId &&  !this.variantAddUpdate){
        // console.log('catch variant data');
        
        if(this.editProductId){
          this.currenlength=this.variantImageList.length;
         let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
          variantArray.clear();
          this.variantIdList=[];
          this.imageIdList=[];
          console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||||||||",this.variantImageList)
       for(let i=0;i<this.variantImageList.length;i++){
         this.imageIdList.push([]);
         variantArray.push(this.fb.group({
          variantGroup:this.fb.array([]),
          imgDataUrl:[''],
          temporaryFile:['']
        }));
         this.variantIdList.push({variant_id:this.variantImageList[i].variant_id,title:this.variantImageList[i].variant_name});
         //variantArray.controls[i].patchValue(this.variantOffer[i].lead);
         let variantGroup=variantArray.controls[i].get('variantGroup') as FormArray;
          for(let j of this.variantImageList[i].imageData){
            if(this.isDefult){
              var isfeatures = 'yes';
        
            }else{
              var isfeatures = 'no';
            }
            this.imageIdList[i].push(j.id)
             variantGroup.push(this.fb.group({
              product_variant_image:[],
              img_url:[j.product_variant_image],
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
   console.log("+++++++++++++++++++++",this.variantLead);
  }
  getLeadGroup(){
   return this.fb.group({
     variantGroup:this.fb.array([]),
     imgDataUrl:[''],
     temporaryFile:['']
   })
  }
  
  /*addSuplyCapcity(index){
   
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
    let variantGroup=variantArray.controls[index].get('variantGroup') as FormArray;
    variantGroup.push(this.getLeadControl());
  }*/

  getProductDetails() {
    const url = API.CRM_ENDPOINTS.PRODUCT_DETAILS_NEW + '/' + this.editProductId;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        this.getVaraintEditdata(result.data);
      },
      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  
}

getVaraintEditdata(data){
  let variantImage=[];
  for(let i=0;i<data.product_variants.length;i++){
    variantImage.push({variant_id:data.product_variants[i].id,variant_name:data.product_variants[i].variant_name,imageData:data.product_variants[i].product_images})
  }

  this.variantImageList=variantImage;
}



  getFeatureKeyFormGroup(...imgeObj):FormGroup{
    if(this.isDefult){
      var isfeature = 'yes';

    }else{
      var isfeature = 'no';
    }
    return this.fb.group({
      product_variant_image:[imgeObj[0]],
      img_url:[imgeObj[1]],
    })
   }
   onChangeKeyFeature(fileList: FileList,index){
    let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
    variantArray.controls[index].get('temporaryFile').setValue(fileList[0]);
     let fileReader: FileReader = new FileReader();
     fileReader.onloadend =  () => {
      // console.log(fileReader.result);
      variantArray.controls[index].get('imgDataUrl').setValue(fileReader.result)
    }
    fileReader.readAsDataURL(fileList[0]);
    }

    setAsDefult(){
      this.isDefult =! this.isDefult ;
    }
   
    addimgeObj(index){
        if(this.isDefult){
          var feature = 'yes';

        }else{
          var feature = 'no';
        }
        this.isDefult = false;
      this.disable=true;
      let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
      let variantGroup=variantArray.controls[index].get('variantGroup') as FormArray;
      this.spinner.show();
      let url = API.CRM_ENDPOINTS.PRODUCTVARIANTIMAGE_ADD + '/' +this.variantIdList[index].variant_id;
      //this.variantIdList[index].variant_id ;
      let formData=new FormData()
      formData.append('is_feature',feature);
      formData.append('product_variant_image',variantArray.controls[index].get('temporaryFile').value)
       this.apiHandlerService.apiPost(url, formData,{},{ contentType: { isFormDataContent: true } }).subscribe({
         next: (data) => {
           if (data.success) {
            this.imageIdList[index].push(data.data.id);
            variantGroup.push(this.getFeatureKeyFormGroup(variantArray.controls[index].get('temporaryFile').value,variantArray.controls[index].get('imgDataUrl').value));
            variantArray.controls[index].get('temporaryFile').setValue(null);
            variantArray.controls[index].get('imgDataUrl').setValue(null);
            this.disable=false;
             this.cdr.detectChanges();
             this.spinner.hide();
             this.toasterService.Success(data.message);
           } else {
            this.spinner.hide();
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
          this.disable=false;
          this.spinner.hide();
           if (typeof err == 'string') {
             this.toasterService.Error(err);
           } else if (err.error && err.error.message) {
             this.toasterService.Error(err.error.message);
           }
           
         },
         complete: () => {
          this.disable=false;
          this.spinner.hide();
         }
       });
    
       setTimeout(() => {
       this.getProductDetails();
         
       }, 1000);

    }
   
   delteFeatreKey(index,imageIndex){
    this.confirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to delete ?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      // console.log(result);
      if(result){
        let variantArray=this.variantLead.get('vriantLeadArray') as FormArray;
        let variantGroup=variantArray.controls[index].get('variantGroup') as FormArray;
        this.spinner.show();
        let url = API.CRM_ENDPOINTS.PRODUCTVARIANTIMAGE_DELETE + '/' + this.imageIdList[index][imageIndex];        
          this.apiHandlerService.apiPost(url, null).subscribe(
            (result: any) => {
              if (result.success === true) {
                this.toasterService.Success(result.message);
                variantGroup.removeAt(imageIndex);
                this.spinner.hide();
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
      
    });

   }


  submit(){
  //  console.log(this.variantLead);
   let message=this.editProductId ? 'Product edit successfully' :'Product create successfully';
   this.toasterService.Success(message);
   //this.stepper.next();
   this.router.navigate(['crm/inventory-management/product-management']);
  }
 
    
}
