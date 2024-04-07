import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-new-product-details',
  templateUrl: './new-product-details.component.html',
  styleUrls: ['./new-product-details.component.css']
})
export class NewProductDetailsComponent implements OnInit {
  @Output() data=new EventEmitter();
  @Input() stepper:MatStepper;
  productDetailsForm:FormGroup;
   modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
  
      ['link', 'image', 'video']                         // link and image, video
    ]
  };
  constructor(private fb:FormBuilder) { }
  setFocus($event) {
    $event.focus();
  }
  ngOnInit(): void {
    this.initForm();
  }
 initForm(){
  this.productDetailsForm=this.fb.group({
   short_product_description:['',Validators.required],
   short_catalogue_description:['',Validators.required],
   key_feature:['',Validators.required],
   catalogue_key_feature:['',Validators.required],

 })
 }
}
