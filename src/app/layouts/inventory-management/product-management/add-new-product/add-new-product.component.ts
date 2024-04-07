
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent implements OnInit {
   product:any
   variantId;
   variantLength=1;
   variantIdList=[];
   variantDataList=[];
   variantLead=[];
   variantOffer=[];
   variantImage=[];
   variantAddUpdate;
    constructor( public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,) { }

  ngOnInit(): void {
    
  }
  updateProductData(data){
   this.product=Object.assign({},data,this.product);
   console.log(this.product);
  }
  updateProductDataBasicInfo(data){
   this.variantId=data;
  }
  getVariantLength(data){
   console.log(data);
   this.variantLength=parseInt(data);
  }
  getVariantIdList(data){
  console.log(data);
  this.variantIdList=data;
  }
  getVaraintEditdata(data){
    this.variantDataList=data.product_variants;
    this.variantId=data.id;
    let variantlead=[];
    let variantOffer=[];
    let variantImage=[];
    for(let i=0;i<data.product_variants.length;i++){
      variantlead.push({variant_id:data.product_variants[i].id,variant_name:data.product_variants[i].variant_name,lead:data.product_variants[i].lead_times});
      variantOffer.push({variant_id:data.product_variants[i].id,variant_name:data.product_variants[i].variant_name,offer:data.product_variants[i].offer_prices});
      variantImage.push({variant_id:data.product_variants[i].id,variant_name:data.product_variants[i].variant_name,imageData:data.product_variants[i].product_images})
    }
    console.log(variantlead);
    this.variantLead=variantlead;
    this.variantOffer=variantOffer;
    this.variantImage=variantImage;
    console.log(data);
  }
  getvariantAddUpdate(data){
   console.log(data);
    this.variantAddUpdate=data;
  }
}