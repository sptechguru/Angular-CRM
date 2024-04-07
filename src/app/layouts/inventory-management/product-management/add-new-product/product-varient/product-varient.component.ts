
import { I } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-product-varient',
  templateUrl: './product-varient.component.html',
  styleUrls: ['./product-varient.component.css']
})
export class ProductVarientComponent implements OnInit {
  @Output() data=new EventEmitter();
  @Input() stepper:MatStepper;
  varientForm: FormGroup;
  imgDataUrl;
  temporaryFile;
  constructor(public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.varientForm = this.fb.group({
      varientlist: this.fb.array([this.getvarientFormGroup()]),
      
    })
  }
  getvarientFormGroup(): FormGroup {
    return this.fb.group({
      varient_option_name: [''],
      flatprice:[true],
      slabprice:[false],
      offerprice:[''],
      slabwise:this.fb.array([this.getSlabFormGroup()]),
      supply_capcity:this.fb.array([this.getsupplyCapcityFormGroup()]),
      imageList:this.fb.array([])
      
    })
  }

  getsupplyCapcityFormGroup(){
    return this.fb.group({
      within_days: [''],
      upto_units:[''],
    })
  }
  addSuplyCapcity(index){
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let suplyCapcity=varientlist.controls[index].get('supply_capcity') as FormArray;
    suplyCapcity.push(this.getSlabFormGroup());
    this.cdr.detectChanges();
  }
  deleteSupplyCapcity(index,supplyCapcityIndex){
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let suplyCapcity=varientlist.controls[index].get('supply_capcity') as FormArray;
    suplyCapcity.removeAt(supplyCapcityIndex);
  }
  getSlabFormGroup():FormGroup{
    return this.fb.group({
      slabofferprice: [''],
      slabstartprice:[''],
      slabendprice:['']
    })
  }
  addSlab(index){
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let slab=varientlist.controls[index].get('slabwise') as FormArray;
    slab.push(this.getSlabFormGroup());
  }
  deleteSlab(index,slabindex){
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let slab=varientlist.controls[index].get('slabwise') as FormArray;
    slab.removeAt(slabindex);
  }
  getFeatureKeyFormGroup(...imgeObj):FormGroup{
    return this.fb.group({
     file:[imgeObj[0]],
     img_url:[imgeObj[1]],
    })
   }
   onChangeKeyFeature(fileList: FileList){
     this.temporaryFile=fileList[0];
     let fileReader: FileReader = new FileReader();
     fileReader.onloadend =  () => {
      console.log(fileReader.result);
      this.imgDataUrl=fileReader.result;
    }
    fileReader.readAsDataURL(fileList[0]);
    }
   
    addimgeObj(index){
       let varientlist = this.varientForm.get('varientlist') as FormArray;
       let imageArray=varientlist.controls[index].get('imageList') as FormArray;
       imageArray.push(this.getFeatureKeyFormGroup(this.temporaryFile,this.imgDataUrl));
       this.temporaryFile=null;
       this.imgDataUrl=null;
       this.cdr.detectChanges();
    }
   
   delteFeatreKey(index,imgaeIndex){
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let imageArray=varientlist.controls[index].get('imageList') as FormArray;
     imageArray.removeAt(imgaeIndex);
   }

/*  getvarientOptionFormGroup(): FormGroup {
    return this.fb.group({
      varient_option_name: ['']
    })
  }

  getVarientCombinationFormGroup(varientValue): FormGroup {
    return this.fb.group({
      varient: [varientValue],
      price: [''],
      quantity: [''],
      sku: [''],
      barcode: ['']
    })
  }
  */
  addVarientOptionName() {
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    varientlist.push(this.getvarientFormGroup());
  }
  
  deleteVarient(index: any) {
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    varientlist.removeAt(index);
  }
  /*addVarientOptionValue(groupIndex: any, controlIndex: any) {
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let varientOptionList = varientlist.controls[groupIndex].get('varient_option_value_list') as FormArray;
    this.createVarientList();
    if (varientOptionList.controls[controlIndex].get('varient_option_name').value != '' && varientOptionList.controls[controlIndex + 1] == undefined) {
      varientOptionList.push(this.getvarientOptionFormGroup());
    }
  }
  deleteVarientOptionValue(groupIndex: any, controlIndex: any, option: any) {
    console.log(option);
    let varientlist = this.varientForm.get('varientlist') as FormArray;
    let varientOptionList = varientlist.controls[groupIndex].get('varient_option_value_list') as FormArray;
    varientOptionList.removeAt(controlIndex);
    this.createVarientList();
  }
 /* createVarientList() {
    let varientlist = this.varientForm.get('varientlist').value;
    let varientOptionList = [];
    for (let i of varientlist) {
      let temporaryVarientOptionList = []
      for (let j of i.varient_option_value_list) {
        if (j.varient_option_name) {
          temporaryVarientOptionList.push(j.varient_option_name);
        }
      }
      varientOptionList.push(temporaryVarientOptionList);
    }
    console.log(varientOptionList);
    let temporaryVarientList: any = [];
    for (let i = varientOptionList.length - 1; i >= 0; i--) {
      temporaryVarientList = this.combinationOFVarient(varientOptionList[i], temporaryVarientList);
    }
    console.log(temporaryVarientList);
    let temp= this.varientForm.get('varientCombinationList') as FormArray;
    temp.clear();
    for(let i of temporaryVarientList){
      temp.push(this.getVarientCombinationFormGroup(i));
    }
    console.log(this.varientForm.get('varientCombinationList'));
    
  }
  combinationOFVarient(varientOptionList, temporaryVarientList) {
    var varientCombination = [];
    if (temporaryVarientList.length == 0) {
      return varientOptionList;
    }
    for (var i = 0; i < varientOptionList.length; i++) {
      for (var j = 0; j < temporaryVarientList.length; j++) {
        varientCombination.push(varientOptionList[i] + '/' + temporaryVarientList[j]);
      }
    }
    //console.log(results);
    return varientCombination;
  }


  deleteVarient(index){
    let temp= this.varientForm.get('varientCombinationList') as FormArray;
    temp.removeAt(index);
   
  }
  */
}
