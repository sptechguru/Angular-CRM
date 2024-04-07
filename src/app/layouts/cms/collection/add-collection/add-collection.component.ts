import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.css']
})
export class AddCollectionComponent implements OnInit {
  categories: Array<any> = [];
  imageToUpload: File;
  saving = false;
  updateToggle=false;
  collectionForm:FormGroup;
  constructor(
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public dialogRef: MatDialogRef<AddCollectionComponent>,
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.getProductCategories('');
    this.initForm();
    if(this.data!=null){
      this.updateToggle=true;
      this.collectionForm.get('category').setValue(this.data.master_product_category_id);
      this.collectionForm.get('pmin').setValue(this.data.filters.base_price.min);
      this.collectionForm.get('pmax').setValue(this.data.filters.base_price.max);
      this.collectionForm.get('stock').setValue(this.data.filters.stock.min); 
    }
    console.log(this.collectionForm.value);
  }
  initForm(){
   this.collectionForm=this.fb.group({
    category:[''],
    pmin:['0',[Validators.required]],
    pmax:['15000',[Validators.required]],
    stock:['0',[Validators.required]]
   })
  }

getProductCategories(search_text) {
  const limit = 100;
  let pageObj = {
    search_text: search_text,
  };
  pageObj["limit"] = limit;
  pageObj["offset"] = 0;
  this._api.apiGet(API.CRM_ENDPOINTS.CATEGORY_LIST, pageObj).subscribe({
    next: next => {
       console.log(next);
      this.categories = next.data.rows

    },
    error: err => {
      // console.log(err);

    },
    complete: () => {

    }
  })
}
handleFileInput(files: FileList) {
  this.imageToUpload = files.item(0);
}
  onselectionChange() {
  
  }

  Submit() {
    let endpoint ;
    console.log(this.collectionForm.value);
    if (this.collectionForm.invalid) return;
    this.saving = true;
    const formData: FormData = new FormData();
    if(this.updateToggle){
      endpoint=API.CRM_ENDPOINTS.UPDATE_COLLECTION(this.data.id);
    }
    else{
      endpoint=API.CRM_ENDPOINTS.ADD_COLLECTION;
      if (this.imageToUpload) {
        formData.append('cover_image', this.imageToUpload, this.imageToUpload.name);
      }
      else{
        this.saving = false;
        return;
      }
    }
    let filter={"base_price":{"min":this.collectionForm.get('pmin').value,max:this.collectionForm.get('pmax').value},"stock": {"min":this.collectionForm.get('stock').value}}
    formData.append('category_id', this.collectionForm.get('category').value);
    formData.append('filters',JSON.stringify(filter));
    this._api.apiPost(endpoint, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
      next: next => {
        // console.log(next);
        this.toaster.Success(next.message)
        this.dialogRef.close(true);
        this.saving = false;
      },
      error: err => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err)

        this.saving = false;
      },
      complete: () => {
        this.saving = false;
  
      }
    })
  }

}























