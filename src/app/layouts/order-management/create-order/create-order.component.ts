
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {


  createOrderForm:FormGroup;
  search_details:boolean = false;
  user_id :any;
  myControl = new FormControl();
  options: any = [];
  searchList:any;
  filteredOptions: Observable<string[]>;

  constructor(public fb: FormBuilder,
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public router: Router) {
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    let user = localStorage.getItem('userData');
    let myobj = JSON.parse(user)
    let res = myobj.data;
    this.user_id = res.id;
    console.log(this.user_id);
    this.getAdressById();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  upload(event:Event){
    console.log(event)
 }

  createOrderMethod(){
    alert("order methodd..");
  }


  getSearch(){
    this._api.getSearchList(this.user_id).subscribe({
      next: (res) => {
        this.options = res['data'].rows;
        this.search_details = true;
        console.log(this.options)
      },
      error: (err) => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err);
      }
    });
  }


  getAdressById(){
    this._api.getAddress(this.user_id).subscribe({
      next: (res) => {
        this.options = res['data'].rows;
        this.search_details = true;
        console.log(this.options)
      },
      error: (err) => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err);
      }
    });
  }


}
