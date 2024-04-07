import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  createUserForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  userid: any;
  city_id: any;
  citys:any;
  isAdd: boolean = false;
  isDraftrValid: boolean = false;
  isApproveValid: boolean = false;
  StateList: any;
  country_list: any;
  CityList: any;
  userStatus:any;
  userList:any = [];
  apiStatus : string = "draft"
  public filteredCountries: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public state: FormControl = new FormControl();
  public stateFilterCtrl: FormControl = new FormControl();
  public filteredStates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public city: FormControl = new FormControl();
  public connectLoader: boolean;
  public cityFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  public countryFilterCtrl: FormControl = new FormControl();
  public filteredCities: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public fb: FormBuilder,
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public router: Router) {
  }
  get f() { return this.createUserForm.controls; }

  ngOnInit(): void {
    this.userForm();
    this.stateList('');
    this.onTabChanged('');
  }

  userForm() {
    this.createUserForm = this.fb.group({
      first_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,]],
      phone_number: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(9)]],   
      // phone_number:  ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]  
      user_group: ['', Validators.required],
      business_name: ['', Validators.required],
      address_line_1: ['', Validators.required],
      pincode: ["",[Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern('^[1-9][0-9]{5}$')]],
      title: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      gst_no: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(15)]],
    });
  }

  countryList() {
    this.connectLoader = true
    this._api.countryList().subscribe((response: any) => {
      // console.log(response);
      if (response.success) {
        this.country_list = response.data.rows;
        this.connectLoader = false;
        this.filteredCountries.next(this.country_list.slice());
        this.countryFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCountries();
          });
      }
      else {
        this.toaster.Error(response.message);
        this.connectLoader = false;
      }
    })
  }

  private filterCountries() {
    if (!this.country_list) {
      return;
    }
    let search = this.countryFilterCtrl.value;
    if (!search) {
      this.filteredCountries.next(this.country_list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCountries.next(
      this.country_list.filter(
        countries => countries.country.toLowerCase().indexOf(search) > -1
      )
    );
  }

  countryChange(e) {
    this.stateList(e.value);
  }

  stateList(id) {
    this.connectLoader = true
    this._api.stateList(id).subscribe((response: any) => {
      // console.log(response);
      if (response.success) {
        this.StateList = response.data.rows;
        this.connectLoader = false;
        this.filteredStates.next(this.StateList.slice());

        this.stateFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterStates();
          });
      }
      else {
        this.toaster.Error(response.message);
        this.connectLoader = false;
      }
    })
  }

  private filterStates() {
    if (!this.StateList) {
      return;
    }
    let search = this.stateFilterCtrl.value;
    if (!search) {
      this.filteredStates.next(this.StateList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStates.next(
      this.StateList.filter(
        states => states.state.toLowerCase().indexOf(search) > -1
      )
    );
  }

  stateChange(e) {
    this.cityList(e.value);
  }

  cityList(id) {
    this.connectLoader = true
    this._api.cityList(id).subscribe((response: any) => {
      // console.log(response);
      if (response.success) {
        this.CityList = response.data.rows
        this.connectLoader = false;
        this.filteredCities.next(this.CityList.slice());

        this.cityFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCities();
          });
      }
      else {
        this.toaster.Error(response.message);
        this.connectLoader = false;
      }
    })
  }

  private filterCities() {
    if (!this.CityList) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCities.next(this.CityList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCities.next(
      this.CityList.filter(
        cities => cities.city.toLowerCase().indexOf(search) > -1
      )
    );
  }

  showAddForm() {
    this.isAdd = !this.isAdd;
    // this.createUserForm.reset();
  }

  editDraftForm(data:any){
    this.isAdd = !this.isAdd;
    console.log(data);
    this.userid = data.id;
    this.citys = data.id;
    this.createUserForm.patchValue({
    first_name: data.first_name,
    email: data.email,
    phone_number: data.phone_number,
    user_group:data.user_group,
    // business_name:data.reseller_profile.business_name,
    // gst_no:data.reseller_profile.reseller_kyc.gst_no,
    })
    this.citys.forEach(item => {
      console.log(item.id);
      this.city_id = item.id;
    });
    console.log(this.userid);
    console.log(this.city_id);

  }

  userUpdateDraftMethod(){
    this.isApproveValid = false;
    this.isDraftrValid = true;
    this.userStatus = 'draft'
    this.createUserForm.patchValue({
      status:  this.userStatus
    })
    this.UpdatProfielMethod();
  }



  userUpdateApproveMethod() {
    // console.log(this.createUserForm.value);
    let formInValid = this.createUserForm.controls;
    if (formInValid.first_name.status == 'INVALID' || formInValid.email.status == 'INVALID' || formInValid.phone_number.status == 'INVALID' ||
    formInValid.user_group.status == 'INVALID' || formInValid.business_name.status == 'INVALID' || formInValid.title.status == 'INVALID' || 
     formInValid.gst_no.status == 'INVALID' || formInValid.address_line_1.status == 'INVALID' || formInValid.pincode.status == 'INVALID' ) {
      // console.log(this.createUserForm.controls);
      this.isApproveValid = true;
      this.isDraftrValid = false;
    }
    else {
      this.userStatus = 'active'
      this.createUserForm.patchValue({
        status:this.userStatus
      })
      // console.log(this.createUserForm.value.status)
    //  this.createUserMethod();
     this.UpdatProfielMethod();
    }
  }


  userUpdateApproveMethods(){
    this.isApproveValid = false;
    this.isDraftrValid = true;
    this.userStatus = 'active'
    this.createUserForm.patchValue({
      status:  this.userStatus
    })
    this.UpdatProfielMethod();
  }



UpdatProfielMethod(){
    // console.log(this.createUserForm.controls.first_name.status);
    let data = this.createUserForm.value;
    // console.log(data);
    let payload = {
      first_name: data.first_name,
      email: data.email,
      phone_number: data.phone_number,
      user_group: data.user_group,
      business_name: data.business_name,
      gst_no: data.gst_no,
      address_line_1: data.address_line_1,
      address_line_2: '',
      // address_id : 25,
      address_id:this.city_id,
      pincode: data.pincode,
      title: data.title,
      is_default: 'yes',
      city_id: data.city,
      state_id: data.state,
      country_id: 1,
      status:this.userStatus
    }
    // console.log(payload);
    this._api.apiPost(API.CRM_ENDPOINTS.UPDATE_RESELLER_USER +'/'+ this.userid, payload).subscribe({
      next: (next) => {
        // console.log(next);
        if (next.success) {
          this.toaster.Success(next.message);
          // this.router.navigate([""]);
          this.onTabChanged('');
        }
        else {
          this.toaster.Error(next.error.message);
        }
      },
      error: (err) => {
        this.toaster.Error(err.error.message);
      },
    });
  }




  createUserMethod(){
    // console.log(this.createUserForm.controls.first_name.status);
    let data = this.createUserForm.value;
    // console.log(data);
    let payload = {
      first_name: data.first_name,
      email: data.email,
      phone_number: data.phone_number,
      user_group: data.user_group,
      business_name: data.business_name,
      business_type: data.business_type,
      gst_no: data.gst_no,
      address_line_1: data.address_line_1,
      address_line_2: '',
      pincode: data.pincode,
      title: data.title,
      is_default: 'no',
      city_id: data.city,
      state_id: data.state,
      country_id: 1,
      status:this.userStatus
    }
    // console.log(payload);
    this._api.apiPost(API.CRM_ENDPOINTS.CREATE_RESELLER_USER, payload).subscribe({
      next: (next) => {
        // console.log(next);
        if (next.success) {
          this.toaster.Success(next.message);
          // this.router.navigate([""]);
          this.onTabChanged('');
        }
        else {
          this.toaster.Error(next.error.message);
        }
      },
      error: (err) => {
        this.toaster.Error(err.error.message);
      },
    });
  }


  userDraftMethod() {
    // console.log(this.createUserForm.value);
    let formInValid = this.createUserForm.controls;
    if (formInValid.first_name.status == 'INVALID' || formInValid.email.status == 'INVALID' || formInValid.phone_number.status == 'INVALID') {
      this.isApproveValid = false;
      this.isDraftrValid = true;
    } else {
      this.isApproveValid = false;
      this.isDraftrValid = true;
      this.userStatus = 'draft'
      this.createUserForm.patchValue({
        status:  this.userStatus
      })
     this.createUserMethod();
  }
}

  userApproveMethod() {
    // console.log(this.createUserForm.value);
    let formInValid = this.createUserForm.controls;
    if (formInValid.first_name.status == 'INVALID' || formInValid.email.status == 'INVALID' || formInValid.phone_number.status == 'INVALID' ||
    formInValid.user_group.status == 'INVALID' || formInValid.business_name.status == 'INVALID' || formInValid.title.status == 'INVALID' || 
     formInValid.gst_no.status == 'INVALID' || formInValid.address_line_1.status == 'INVALID' || formInValid.pincode.status == 'INVALID' ) {
      // console.log(this.createUserForm.controls);
      this.isApproveValid = true;
      this.isDraftrValid = false;
    }
    else {
      this.userStatus = 'active'
      this.createUserForm.patchValue({
        status:this.userStatus
      })
      // console.log(this.createUserForm.value.status)
     this.createUserMethod();
    }
  }

  onTabChanged(event){
    if(event.index == 0){
      this.apiStatus ="draft"
    }
    if(event.index == 1){
      this.apiStatus ="active"
    }

    this._api.getUserList(this.apiStatus).subscribe({
      next: (res) => {
        this.userList = res['data'];
        // console.log(this.userList)
      },
      error: (err) => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err);
      }
    });

  }

}
