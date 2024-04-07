import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { passwordValidator, password } from 'app/shared/custom/customValidation';
import { CustomeValidationService } from 'app/shared/services/custom-validation.service';

@Component({
  selector: 'app-auth-change-password',
  templateUrl: './auth-change-password.component.html',
  styleUrls: ['./auth-change-password.component.scss']
})
export class AuthChangePasswordComponent implements OnInit {
  isChangePasswordProcessing:boolean = false;
  constructor(
    private _fb : FormBuilder,
    private _api : ApiHandlerService,
    public toster : ToastrService,
    private customeValidationService: CustomeValidationService
  ) { }

  ngOnInit() {
    this.passwordReset()
  }

  passwordResetForm : FormGroup; 
  submitted = false;

  submitPassword(){
    this.isChangePasswordProcessing = true;
    this.submitted = true;
    if(this.passwordResetForm.invalid){
      this.isChangePasswordProcessing = false;
      return;
    }
    this._api.apiPost(API.USER_ENDPONTS.CHANGE_PASSWORD,this.passwordResetForm.value).subscribe({
      next:result=>{

        if(result.success){
          this.toster.success(result.message)
        }
        this.isChangePasswordProcessing = false;
      },
      error:err =>{
       this.toster.error(err.error.message);
       this.isChangePasswordProcessing = false;
      }
    })
  }


  get passwordcontrol(){
    return this.passwordResetForm.controls;
  }

  passwordReset(){
    this.passwordResetForm = this._fb.group({
      current_password:['',Validators.required],
      password : ['',passwordValidator],
      confirm_password:['',Validators.required],
    },{
      validators: [password.bind(this)]
    })
  }

}
