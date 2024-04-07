import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-product-catalogue',
  templateUrl: './product-catalogue.component.html',
  styleUrls: ['./product-catalogue.component.css']
})
export class ProductCatalogueComponent implements OnInit {
 @Output()data:EventEmitter<any>=new EventEmitter();
@Input() stepper:MatStepper;
productCatalogueForm:FormGroup;
imgDataUrl;
temporaryFile;
featureDescription;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
   this.initForm();
  }
initForm(){
  this.productCatalogueForm=this.fb.group({
     header_img:[{value:'',disabled: true}],
     pdffile:[{value:'',disabled: true}],
     featureKeyList:this.fb.array([])
  });
}
getFeatureKeyFormGroup(...featureKey):FormGroup{
 return this.fb.group({
  file:[featureKey[0]],
  img_url:[featureKey[1]],
  description:[featureKey[2]]
 })
}
onChangeHeader(fileList: FileList){
  let file = fileList[0];
  console.log(file);
  this.productCatalogueForm.get('header_img').setValue(file.name);
}
onChangePdf(fileList: FileList){
  let file = fileList[0];
  this.productCatalogueForm.get('pdffile').setValue(file.name);
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

 addFeatureKey(){
  console.log("call feature key");
    console.log(this.featureDescription);
    let featureKeyArray=this.productCatalogueForm.get('featureKeyList') as FormArray;
    featureKeyArray.push(this.getFeatureKeyFormGroup(this.temporaryFile,this.imgDataUrl,this.featureDescription));
    this.temporaryFile=null;
    this.imgDataUrl=null;
    this.featureDescription=null;
}
delteFeatreKey(index){
  let featureKeyArray=this.productCatalogueForm.get('featureKeyList') as FormArray;
  featureKeyArray.removeAt(index);
}

}


