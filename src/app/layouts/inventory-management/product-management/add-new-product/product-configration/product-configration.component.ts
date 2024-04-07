import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-product-configration',
  templateUrl: './product-configration.component.html',
  styleUrls: ['./product-configration.component.css']
})
export class ProductConfigrationComponent implements OnInit {
@Output() data=new EventEmitter();
@Input() stepper:MatStepper;
fileName='';
productConfigrationForm:FormGroup;
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(){
    this.productConfigrationForm=this.fb.group({
      customisation_possible:['',Validators.required],
      customisation_type:['',Validators.required],
      customised_sample:['',Validators.required],
      customisation_position:['',Validators.required],
      customisation_location:['',Validators.required],
      customisation_setup_cost:['',Validators.required],
      customisation_cost:['',Validators.required],
      customisation_template:['',Validators.required]
    })
  }
  onChangePdf(fileList: FileList){
    let file = fileList[0];
    this.fileName=file.name;
    
  }
}
