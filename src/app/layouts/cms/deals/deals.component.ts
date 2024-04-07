import { trigger, transition,query, style, stagger, animate, keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

import { data } from 'jquery';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css'],
   animations: [

    trigger('listAnimation', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('1000ms ease-in', keyframes([
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

  ],
   providers: [ConfirmationDialogHandlerService]
})
export class DealsComponent implements OnInit {

  constructor(
    private _api : ApiHandlerService,
    private dialog : ConfirmationDialogHandlerService,
    private toaster : ToasterService
  ) { }
  queryObject :any={};
  page=1
  categories :any;
  loadingProduct = false;
  chooseProduct = false;
  dealId :number

  productList :any

  deals :any;

  editMode = false;

  searchText:string;

  ngOnInit(): void {
       this.queryObject = {
          page: this.page,
        search_text: ""
        };
        this.getDeals(this.queryObject)
  }
  panelOpenState = false;

  getDeals(data){
    const url = API.CRM_ENDPOINTS.GET_DEALS_NAME;
      const limit =  10;
      let pageObj = {
        search_text: data.search_text,
        ...data,
      };
      pageObj["limit"] = limit;
      pageObj["offset"] = (data.page - 1) * limit;
      if (data.sortFied && data.orderBy) {
        pageObj["sort_field"] = data.sortFied;
        pageObj["order_by"] = data.orderBy;
      }
    this._api.apiGet(url,data).subscribe({
      next:next=>{
        // console.log(next);
        this.deals = next.data.rows
        
      },
      error:err=>{
        // console.log(err);
        
      },
      complete:()=>{

      }
    })
  }

 


 
 

 





  


}
