import { Component, OnInit } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';

@Component({
  selector: 'app-menu-manegment',
  templateUrl: './menu-manegment.component.html',
  styleUrls: ['./menu-manegment.component.css']
})
export class MenuManegmentComponent implements OnInit {

  constructor(
    private _api : ApiHandlerService,
  ) { }

  ngOnInit(): void {
    this.getMenuList();
  }

  getMenuList(){
    const api = API.CRM_ENDPOINTS.GET_MENU;
    let pageObj: any = {
      limit:50,
      offset:0
    };
    
  
    this._api.apiGet(api,pageObj).subscribe({
      next:next => {
        console.log(next);
        
      },
      error:error =>{},
      complete: () => {}
    })
  }

}
