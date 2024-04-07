import { Component, OnInit } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ERROR_MSG } from 'app/shared/constants/consts';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './auth-forgot-password.component.html',
  styleUrls: ['./auth-forgot-password.component.css']
})
export class AuthForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorMessages = ERROR_MSG;

  isForgotPasswordProcessing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private toasterService: ToasterService
  ) {
    // logout user on constructor call. This will logout already 'signed in' user to logout when
    // he tries to navigate to '/signin' from browser.
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          )
        ])
      ]
    });
  }

  handleSubmit() {
    if (this.forgotPasswordForm.valid && !this.isForgotPasswordProcessing) {
      this.isForgotPasswordProcessing = true;
      const formVal = this.forgotPasswordForm.value;
      this.apiHandlerService.apiPost(
        API.AUTH_ENDPOINTS.FORGET_PASSWORD,
        {
          email: this.email.value,
          verification_type: 'email'
        }).subscribe({
          next: result => {
            let msg = (result.message) ? result.message : 'Email sent successfully, Please follow the guide to reset your password';
            this.forgotPasswordForm.reset();
            this.toasterService.Success(msg);
            this.router.navigate(['auth/login']);
          },
          error: err => {
            let msg;
            if (err && err.error && err.error.message) {
              msg = err.error.message;
            } else if (err && err.message) {
              msg = err.message;
            }
            this.forgotPasswordForm.reset();
            this.toasterService.Error(msg);
            this.isForgotPasswordProcessing = false;
          },
          complete: () => {
            this.isForgotPasswordProcessing = false;
          }
        });
    }
  }

  /* Getters for accessing reactive form elements are defined below */

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
