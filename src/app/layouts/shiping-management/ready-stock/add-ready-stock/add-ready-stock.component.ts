import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddCollectionComponent } from 'app/layouts/cms/collection/add-collection/add-collection.component';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-add-ready-stock',
  templateUrl: './add-ready-stock.component.html',
  styleUrls: ['./add-ready-stock.component.css']
})
export class AddReadyStockComponent implements OnInit {

  saving = false;
  updateToggle=false;
  stockForm:FormGroup;
  readyStockMinValidation=false;
  madeStockMinValidation=false;
  constructor(
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public dialogRef: MatDialogRef<AddCollectionComponent>,
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.initForm();
    if(this.data!=null){
      this.updateToggle=true;
      this.stockForm.get('min_ready_eta').setValue(this.data.source_zones[0].shipping_timing.min_ready_eta);
      this.stockForm.get('max_ready_eta').setValue(this.data.source_zones[0].shipping_timing.max_ready_eta);
      this.stockForm.get('min_mto_eta').setValue(this.data.source_zones[0].shipping_timing.min_mto_eta);
      this.stockForm.get('min_mto_eta').setValue(this.data.source_zones[0].shipping_timing.min_mto_eta); 
      this.stockForm.get('max_mto_eta').setValue(this.data.source_zones[0].shipping_timing.max_mto_eta); 
    }
    console.log(this.stockForm.value);
  }
  initForm(){
   this.stockForm=this.fb.group({
    //stae:['',Validators.required],
    //source_zone:['',Validators.required],
    //delivery_zone:['',Validators.required],
    min_ready_eta:['',Validators.required],
    max_ready_eta:['',Validators.required],
    min_mto_eta:['',Validators.required],
    max_mto_eta:['',Validators.required]
   })
  }


  Submit() {
    console.log(this.stockForm.value);
    if(this.stockForm.invalid){
     return ;
   }
   if(this.stockForm.get('min_ready_eta').value > this.stockForm.get('max_ready_eta').value){
    this.readyStockMinValidation=true
    return;
   }
   if(this.stockForm.get('min_mto_eta').value > this.stockForm.get('max_mto_eta').value){
    this.madeStockMinValidation=true
    return;
   }
   this.saving=true;
   const endpoint=API.SHIPING_ENDPOINTS.UPDATE_READY_STOCK(this.data.id);
   this._api.apiPost(endpoint, this.stockForm.value, {}).subscribe({
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
