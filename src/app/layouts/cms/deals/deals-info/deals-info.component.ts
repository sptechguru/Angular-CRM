import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import { CropImageComponent } from '../../slider/crop-image/crop-image.component';
import { MatDialog } from '@angular/material/dialog';
function clearFileInput(ctrl) {
  try {
    ctrl.value = null;
  } catch (ex) { }
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}
@Component({
  selector: 'app-deals-info',
  templateUrl: './deals-info.component.html',
  styleUrls: ['./deals-info.component.css'],
    animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('500ms ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true}),
           query(':leave', stagger('300ms', [
          animate('500ms ease-in', keyframes([
            style({opacity: 1, transform: 'translateY(0)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 0, transform: 'translateY(-75%)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])

  ]
})
export class DealsInfoComponent implements OnInit {

  constructor(
      private _api : ApiHandlerService,
    private dialog : ConfirmationDialogHandlerService,
    private toaster : ToasterService,
    private route : ActivatedRoute,
    public model: MatDialog
  ) { }

   productArray :any = [];
productsearchText:string
   queryObject :any={};
    dealsName : string;
    dealsNameImage : string;
  page=1
  categories :any;
  loadingProduct = false;
  chooseProduct = false;
  dealId :number
  fileToUpload: File = null;
  productList :any

  deals :any;

  editMode = false;

  searchText:string;

  ngOnInit(): void {
    this.dealId = this.route.snapshot.params.id
    this.productsInDeals(this.dealId);
    
       this.queryObject = {
          page: this.page,
        search_text: ""
        };
        this.getProductCategories('')
  }
  panelOpenState = false;

 newItemEvent(data){

  data.forEach(y=>{
  if(!this.productArray.find(x=>x.id === y.id)){
    this.productArray = [...this.productArray ,y]
  }
   
  })   
 }

 deleteItemEvent(data){
 
  let index =   this.productArray.indexOf(data)
  if (index !== -1) {
 this.productArray.splice(index, 1);
 
 
}
 
 }

 handleFileInput(files) {
  if (files.target.files.length === 0) return clearFileInput(document.getElementById("myFileInput"));

 


  this.model.open(CropImageComponent, {
    data: { files, type: {height: 400, width: 670} },
    width: '100%',
    panelClass: 'crop-image-dialog'
  }).afterClosed().subscribe(data => {
    files = null
    if (data) {
      this.fileToUpload = data
      this.updateData('file')
    
    }
    else clearFileInput(document.getElementById("myFileInputRoad"));
  })
  // this.fileToUpload = files.item(0);
}

updateData(type: 'name'|'file',name: string = null) {
  

  
  const endpoint = API.CRM_ENDPOINTS.UPDATE_DEALS_NAME(this.dealId);
  
  const formData: FormData = new FormData();
  if(type === 'file') formData.append('deal_image', this.fileToUpload, this.fileToUpload.name);

  formData.append('deal_name', name || this.dealsName);
  
 
  
  this._api.apiPost(endpoint, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
    next: next => {
      this.toaster.Success(next.message)
      clearFileInput(document.getElementById("myFileInput"));
     
      this.fileToUpload = null;
     
     
    },
    error: err => {
      
      this.toaster.Error(err.error.message)

    },
    complete: () => {

    }
  })
}

  productsInDeals(id){
    const url = API.CRM_ENDPOINTS.GET_PRODUCTS_DEALS(id);
     const limit =  100;
      let pageObj :any = { };
      pageObj["limit"] = 19;
      pageObj["offset"] = 0;
      this.loadingProduct = true
    this._api.apiGet(url,pageObj).subscribe( {
      next:next=>{
        // console.log(next);

         this.productList = next.data?.rows[0] && next.data?.rows[0]?.product_variants;
         this.dealsName = next.data?.rows[0] ?  next.data.rows[0].deal_name : 'Add product First'
         this.dealsNameImage =  next.data?.rows[0] &&  next.data?.rows[0]?.deal_image;
        // console.log(next );
        
      },
      error:err=>{ 
        // console.log(err);
        this.loadingProduct = false
      },
      complete:()=>{
        this.loadingProduct = false

      }
    })
  }

  onOpen(id){

    this.dealId = id
  this.productList = [];
 this.productsInDeals(id)
  }
  onClosed(){
    this.dealId = null;
    this.productList = [];
    this.editMode = false;
    this.searchText = '';
    this.chooseProduct = false;
  }
  cancel(){
     this.productList = [];
    this.editMode = false;
    this.searchText = '';
    this.chooseProduct = false;
    this.productsInDeals(this.dealId)

  }

 
   getProductCategories(search_text){
    const limit = 100;
     let pageObj = {
        search_text: search_text,
      };
      pageObj["limit"] = limit;
      pageObj["offset"] = 0;
    this._api.apiGet(API.CRM_ENDPOINTS.CATEGORY_LIST,pageObj).subscribe( {
      next:next=>{
        // // console.log(next);
        this.categories = next.data.rows
        
      },
      error:err=>{
        // console.log(err);
        
      },
      complete:()=>{

      }
    })
  }

  addProductOnClick(id){
    this.dialog.openDialog({question:'Are you want to add all product of this category?',confirmText:'Yes',cancelText:'No'}).subscribe(response=>{
       this.editMode = false;
    })
  }

  
  drop(event: CdkDragDrop<[any]>) {
    moveItemInArray(this.productArray, event.previousIndex, event.currentIndex);
  }
  addProductsIntoDeals(){

      let id = this.productArray.map(data=>
            {
              return data.product_variants.map(x=>{
                // console.log();
                
                return x.id;
              })
            })
            let newIdArray = id.flat(1)
           
          // console.log(newIdArray);

const url = API.CRM_ENDPOINTS.ADD_PRODUCTS_INTO_DEALS(this.dealId)



this._api.apiPost(url ,{variant_list:[...newIdArray]}).subscribe({
      next:next=>{
        // console.log(next);
        // this.categories = next.data.rows
        this.productList=[];
        this.chooseProduct = false;
        this.productArray = [];
        this.editMode = false
        this.productsInDeals(this.dealId)
       this.toaster.Success(next.message)
        
      },
      error:err=>{
  
       this.toaster.Error(err.error.message)

      },
      complete:()=>{

      }}
      )
  }


  removeProducts(){

  }
  changeDealName(name:string){
    if(name.length === 0) return;
    
     this._api.apiPost(API.CRM_ENDPOINTS.UPDATE_DEALS_NAME(this.dealId),{deal_name:name}).subscribe({
      next:next=>{
       
       this.toaster.Success(next.message)
      },
      error:err=>{
        // console.log(err);

        
      },
      complete:()=>{

      }}
      )
  }

  onProductClick(id){
    if( this.productList[id].selected){
       this.productList[id] = {...this.productList[id],selected : false}

    }else  this.productList[id] = {...this.productList[id],selected : true} 
  }

 

}