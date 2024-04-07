import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs-compat/operator/map';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  userType:string
  id:string
  userData :any= {}

  constructor(
    private _api : ApiHandlerService,
    private _route : ActivatedRoute
  ) {
    // console.log();
    this.id = this._route.snapshot.paramMap.get('id')
    this.userType = this._route.snapshot.paramMap.get('userType')
    // console.log();
   }

  ngOnInit(): void {
    this.getUser()
  }


  getUser(){
    this._api.apiGet(`${API.ADMIN_USER_ENDPOINTS.GET_USER_LIST}/${this.userType}/${this.id}`).subscribe({
      next:result=>{
       this.userData = result.data
       // console.log(this.userData);
      },
      error:err=>{

      }, 

    })  
  }
}
