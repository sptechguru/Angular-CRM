import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.css']
})
export class ProductPriceComponent implements OnInit {
  @Output() data=new EventEmitter();
  @Input() stepper:MatStepper;
  priceForm:FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }
 initForm(){
   this.priceForm=this.fb.group({
    product_price:['',Validators.required],
    product_compare_price:['',Validators.required],
    product_cost_per_item:['',Validators.required],
    product_quantity:['',Validators.required],
    margin:['',Validators.required],
    profit:['',Validators.required],
    charge_on_tax:['',Validators.required]
   })
 }
}
