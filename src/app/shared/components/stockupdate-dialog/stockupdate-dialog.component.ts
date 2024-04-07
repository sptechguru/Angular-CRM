import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title?: "Update Stock";
  quantity?: any;
  sstock?: any;
  rstock?: any;
  cancelText?: any;
}

@Component({
  selector: 'stockupdate-dialog',
  templateUrl: 'stockupdate-dialog.component.html',
})
export class StockupdateDialogComponent {
  addnewsku: FormGroup;
  newadjustment: any;
  newsstock: any;
  newrstock: any;
  adjustment_reason: any;
  adjustment_description: any;
  mquantity: any;
  constructor(
    public dialogRef: MatDialogRef<StockupdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public diologConfig: DialogData,
    public fb: FormBuilder,) { }
  ngOnInit(): void {
    //  this.productid = this.activatedRoute.snapshot.params.productid;
    this.initformgroup();
  }
  initformgroup() {
    this.addnewsku = this.fb.group({
      adjustment: ['', Validators.required],
      adjustment_reasone: ['', Validators.required],
      adjustment_description: [''],
      reserve_stock: ['', Validators.required],
      sampleadjustment: ['', Validators.required],
      quantity: ['', Validators.required],
      ready_stock: [''],
      result_adj: [''],
      result_sample: [''],
      result_rstock: [''],
      rstock: [''],

    })

  }
  onNoClick(): void {

    this.dialogRef.close();
  }
  changevaluestock(event: any) {
    // let sample = this.addnewsku.get('sampleadjustment').value;
    let newval = this.addnewsku.get('adjustment').value;
    if (newval.includes('-')) {
      console.log(newval.substring(1))
      let strs = newval.substring(1);
      let val = this.diologConfig.quantity - strs;
      this.addnewsku.get('result_adj').setValue(val);
      this.newadjustment = newval      
    } else {     
      let strs = newval.includes('+') ? newval.substring(1) : newval;      
      let val = Number(this.diologConfig.quantity) + Number(strs);
      this.addnewsku.get('result_adj').setValue(val);
      this.newadjustment = newval;    

    }

  }
  changevaluesample(event: any) {
    let sample = this.addnewsku.get('sampleadjustment').value;
    if (sample.includes('-')) {
      let strs = sample.substring(1);
      let val = this.diologConfig.sstock - strs;
      this.addnewsku.get('result_sample').setValue(val);
      this.newsstock = sample
    } else {
      let strs = sample.includes('+') ? sample.substring(1) : sample;
      let val = Number(this.diologConfig.sstock) + Number(strs);
      this.addnewsku.get('result_sample').setValue(val);
      this.newsstock = sample
    }
  }
  
  changevaluerstock(ev: any) {
    let stock = this.addnewsku.get('rstock').value;
    this.addnewsku.get('result_rstock').setValue(stock);
    this.newrstock = stock
    }

  changedescription(ev: any) {
    this.adjustment_description = this.addnewsku.get('adjustment_description').value;
  }
  changereason(ev: any) {
    console.log(this.addnewsku.get('adjustment_reasone').value)
    this.adjustment_reason = this.addnewsku.get('adjustment_reasone').value;
  }





}