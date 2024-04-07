import { Component, Input, OnInit ,Output, EventEmitter} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-deals-products',
  templateUrl: './deals-products.component.html',
  styleUrls: ['./deals-products.component.css']
})
export class DealsProductsComponent implements OnInit {

  constructor(
      private _api : ApiHandlerService,
    private dialog : ConfirmationDialogHandlerService,
    private toaster : ToasterService,
    private route : ActivatedRoute
  ) { }

  @Input() item : any;
  loading = true
  @Input() productArray :any = [];

  @Output() newItemEvent = new EventEmitter<any>();
  @Output() deleteItemEvent = new EventEmitter<any>();

  searchText:string

  productList:any 

  open : boolean = false


  onChange(checked , product){
   // console.log(checked , product);

   if(checked){
      this.newItemEvent.emit([product])
      return
   }else{
      this.deleteItemEvent.emit(product)
      return
   }
    
   
  }
  isProductIsAdd(id){
   return !!this.productArray.find(x=>x.id === id)
  }

  ngOnInit(): void {
  }

  openModel(){
    this.open ? this.open = false : this.open = true;
    this.productList || this.getProduct(this.item.id)
  }
  addAllProducts(){
   this.newItemEvent.emit(this.productList)
  }

    getProduct(id,addProduct = false){
 
    this._api.apiPost(API.CRM_ENDPOINTS.GET_FILTER_PRODUCT,{category_ids:[id]}).subscribe( {
      next:next=>{
          // console.log(next);
        this.productList = next.data.rows
        this.loading = false;
        if(addProduct){
          let id = this.productList.map(data=>
            {
              return data.product_variants.map(x=>{
              
                
                return x.id;
              })
            })
            let newIdArray = id.flat(1)
           
          // console.log(newIdArray);
         
          return;
        }
      this.productList =  this.productList.map(data=>{
        return {...data,selected: true}
      })
        
      },
      error:err=>{
        // console.log(err);
        
      },
      complete:()=>{

      }
    })
  }

}
