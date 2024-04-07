import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { API } from 'app/shared/constants/endpoints';
import { ERROR_MSG } from 'app/shared/constants/consts';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { patternValidator, password } from 'app/shared/custom/customValidation';
import { CustomeValidationService } from 'app/shared/services/custom-validation.service';

@Component({
  selector: 'app-auth-reset-password',
  templateUrl: './auth-reset-password.component.html',
  styleUrls: ['./auth-reset-password.component.scss']
})
export class AuthResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errorMessages = ERROR_MSG;

  isResetPasswordProcessing = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private toasterService: ToasterService,
    private customeValidationService: CustomeValidationService
  ) {
    // logout user on constructor call. This will logout already 'signed in' user to logout when
    // he tries to navigate to '/signin' from browser.
  }

  ngOnInit() {
    let email_code = this.route.snapshot.paramMap.get('email_code');
    this.createForm(email_code);
  }

  createForm(email_code: string) {
    this.resetPasswordForm = this.fb.group({
      email_code: [email_code],
      password: [
        '',
        Validators.compose([
          Validators.required,
         
        ])
      ],
      confirm_password: [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
    }, {
      validator: this.customeValidationService.MatchPasswordWithConfirmPassword('password', 'confirm_password')
    });
  }

  handleSubmit() {
    if (this.resetPasswordForm.valid && !this.isResetPasswordProcessing) {
      this.isResetPasswordProcessing = true;
      const formVal = this.resetPasswordForm.value;
      this.apiHandlerService.apiPost(
        API.AUTH_ENDPOINTS.RESET_PASSWORD,
        formVal
      ).subscribe({
        next: result => {
          let msg = (result.message) ? result.message : 'Password reset successfully.';
          this.toasterService.Success(msg);
          this.resetPasswordForm.reset();
          this.router.navigate(['auth/login']);
        },
        error: err => {
          let msg;
          if (err && err.error && err.error.message) {
            msg = err.error.message;
          } else if (err && err.message) {
            msg = err.message;
          }
          this.resetPasswordForm.reset();
          this.toasterService.Error(msg);
          this.isResetPasswordProcessing = false;
        },
        complete: () => {
          this.isResetPasswordProcessing = false;
        }
      });
    }
  }

  /* Getters for accessing reactive form elements are defined below */

  get password() {
    return this.resetPasswordForm.get('password');
  }
  get confirm_password() {
    return this.resetPasswordForm.get('confirm_password');
  }

}
