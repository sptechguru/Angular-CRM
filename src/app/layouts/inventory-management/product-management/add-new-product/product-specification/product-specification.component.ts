import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-product-specification',
  templateUrl: './product-specification.component.html',
  styleUrls: ['./product-specification.component.css']
})
export class ProductSpecificationComponent implements OnInit {
  @Output() data=new EventEmitter();
  @Input() stepper:MatStepper;
  specificationlist=[];
  selected_specification=[];
  constructor() { }

  ngOnInit(): void {
  }
  addSpecification(specificationAttribute:any,specificationvalue:any){
   // console.log(specificationAttribute);
   // console.log(specificationvalue);
    this.specificationlist.push({specification_type:specificationAttribute,specification_description:specificationvalue});
   // console.log(this.specificationlist);
    this.selected_specification.push(specificationAttribute);
 }
 removeSpecification(index){
   this.specificationlist.splice(index,1);
   this.selected_specification.splice(index,1);
 }
}
