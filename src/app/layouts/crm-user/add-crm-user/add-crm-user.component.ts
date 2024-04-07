import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-crm-user',
  templateUrl: './add-crm-user.component.html',
  styleUrls: ['./add-crm-user.component.css']
})
export class AddCrmUserComponent implements OnInit {

   hide = true;

  constructor(private _fb : FormBuilder,
    private router :Router,
     private _api : ApiHandlerService ,
     private _storage : StorageAccessorService,
      private toast : ToasterService) { }
   emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();
  loading = false;

  ngOnInit(): void {
    this.createForm()
  }
  userForm:FormGroup;

  createForm(){
    this.userForm = this._fb.group({
      first_name : ['',Validators.required],
      last_name : ['',Validators.required],
      phone_number  : ['',[Validators.required ,Validators.maxLength(10),Validators.minLength(10)]],
      email :['',[ Validators.required, Validators.email,]],
      fk_user_role_id :4
    })
  }

  get formControl(){
   return this.userForm.controls
  }

  createUser(){
   
   
    if(this.userForm.invalid) return;

    let role = this._storage.fetchUserDetailsByKey('fk_user_role_id');

    this.userForm.patchValue({fk_user_role_id : role === 2 ? 4 : 5})
   this.loading = true;
    this._api.apiPost(API.CRM_ENDPOINTS.CREATE_CRM_USER,this.userForm.value).subscribe({
      next:result=>{
       if(result.success){
         this.toast.Success(result.message)
          this.loading = false;
         // console.log();
         this.userForm.reset();
         this.userForm.markAsUntouched();
        //  this.router.navigate(['/crm/crm-user/crm-user-details' ,result.data.rows.id])
         

       }
      },
      error:err=>{

    this.loading = false;
        // // console.log(err);
        
         this.toast.Error(err.error.message)
      

      },
      complete:()=>{

      }
    })
  }

}
