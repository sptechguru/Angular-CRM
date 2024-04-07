import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent implements OnInit {
productImageForm:FormGroup;
imgDataUrl;
temporaryFile;
  constructor(private fb:FormBuilder,private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
   this.initForm();
  }
initForm(){
  this.productImageForm=this.fb.group({
     imageList:this.fb.array([])
  });
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

 addimgeObj(){
    let imageArray=this.productImageForm.get('imageList') as FormArray;
    imageArray.push(this.getFeatureKeyFormGroup(this.temporaryFile,this.imgDataUrl));
    this.temporaryFile=null;
    this.imgDataUrl=null;
    this.cdr.detectChanges();
 }

delteFeatreKey(index){
  let imageArray=this.productImageForm.get('imageList') as FormArray;
  imageArray.removeAt(index);
}

}
