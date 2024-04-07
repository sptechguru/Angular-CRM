import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-product-shiping',
  templateUrl: './product-shiping.component.html',
  styleUrls: ['./product-shiping.component.css']
})
export class ProductShipingComponent implements OnInit {
  @Output() data=new EventEmitter();
  @Input() stepper:MatStepper;
  shipingForm:FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }
 initForm(){
   this.shipingForm=this.fb.group({
     product_source_zone:['',Validators.required],
     sample_source_zone:['',Validators.required],
     product_weight:['',Validators.required],
     product_shiping_box:['',Validators.required],
     product_quantity_box:['',Validators.required]
   })
 }
}
