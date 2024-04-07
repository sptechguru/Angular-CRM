import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { passwordValidator, password } from 'app/shared/custom/customValidation';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private api : ApiHandlerService,
    private fb : FormBuilder,
    private toaster : ToasterService
  ) { }
  passwordHide = false;
  confirmHide = false
  oldPassword = false;

  submitted =false;

  adminForm : FormGroup
  passwordResetForm : FormGroup;
  adminData:any = {}

  ngOnInit() {
    this.createForm()
    this.passwordReset()
    this.getUser()
    // this.adminForm.disable()

   
  }

  createForm(){
    this.adminForm = this.fb.group({
      first_name:['',Validators.required],
      last_name: ['',Validators.required],
      email:['',Validators.required],
      phone_no:['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      zip_code:['',Validators.required],
      address_line1:['',Validators.required]
    })
  }

  passwordReset(){
    this.passwordResetForm = this.fb.group({
      current_password:['',Validators.required],
      password : ['',passwordValidator],
      confirm_password:['',Validators.required],
    },{
      validators: [password.bind(this)]
    })
  }
  get formControls(){
    return this.adminForm.controls;
  }
  get passwordcontrol(){
    return this.passwordResetForm.controls;
  }
  submitPassword(){
    // this.submitted = true;
    if(this.passwordResetForm.invalid) return;
    this.api.apiPost(API.USER_ENDPONTS.CHANGE_PASSWORD,this.passwordResetForm.value).subscribe({
      next:result=>{

        if(result.success){
          this.toaster.Success(result.message)
          this.passwordResetForm.reset();
        }
      },
      error:err =>{
        // // console.log(err);
       this.toaster.Error(err)
      }
    })
  }


  formSubmit(){
    // console.log(this.adminForm);
    
    if(this.adminForm.invalid) return;
    this.api.apiPost(API.AUTH_ENDPOINTS.UPDATE_PROFILE,this.adminForm.value).subscribe({
      next:response=>{
       this.toaster.Success(response.message)
      },
      error:err=>{
        this.toaster.Error(err)
      }
    })
  }
  
  getUser(){
    this.api.apiGet(API.USER_ENDPONTS.MY_DETAILS).subscribe({
      next:response=>{
        // console.log(response.data);
        
       this.adminData = response.data
       this.setData()
      },
      error:err=>{
        this.toaster.Error(err)
      }
    })
  }

  setData(){
    this.adminForm.patchValue({
      first_name : this.adminData.first_name,
      last_name : this.adminData.last_name,
      email : this.adminData.email,
      phone_no : this.adminData.phone_no,
      city : this.adminData.city,
      country : this.adminData.country,
      zip_code : this.adminData.zip_code,
      address_line1 : this.adminData.address_line1,
    })
  }
}
