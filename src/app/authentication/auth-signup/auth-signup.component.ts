import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ERROR_MSG } from 'app/shared/constants/consts';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef; files = [];
  signupForm: FormGroup;
  errorMessages = ERROR_MSG;

  isLoginProcessing = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    // private authService: AuthService,
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
    this.signupForm = this.fb.group({
      first_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(
            /[a-zA-Z]+/
          )
        ])
      ],
      last_name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(
            /[a-zA-Z]+/
          )
        ])
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          )
        ])
      ],
      phone_number: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/
          )
        ])
      ],
      business_name: [
        '',
        Validators.compose([Validators.required])
      ],
      business_type: [
        '',
        Validators.compose([Validators.required])
      ],
      business_logo: [
        '',
        // Validators.compose([Validators.required])
      ]
    });
  }

  handleSubmit() {
    if (this.signupForm.valid && !this.isLoginProcessing) {
      this.isLoginProcessing = true;
      let formData = this.prepareSignUpFormData();
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.SIGN_UP, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
        next: result => {
          if (result.message) {
            this.toasterService.Success('result.message');
            this.router.navigate(['auth/login']);
          } else {
            let msg = (result.message) ? result.message : 'Unable to signup.';
            this.toasterService.Error(msg);
          }
          this.isLoginProcessing = false;
        },
        error: err => {
          let msg = (err.error && err.error.message) ? err.error.message : err;
          this.toasterService.Error(err);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        }
      });
    }
  }

  prepareSignUpFormData(): any {
    let formData = new FormData();
    Object.keys(this.signupForm.value).forEach((formControlNane) => {
      formData.append(formControlNane, this.signupForm.get(formControlNane).value);
    });
    return formData;
  }

  onFileChange(fileList: any) {
    const fileUpload = this.fileUpload.nativeElement;
    const file = fileUpload.files[0];
    this.signupForm.patchValue({
      business_logo: file
    });
    this.signupForm.get('business_logo').updateValueAndValidity()

  }

  /* Getters for accessing reactive form elements are defined below */

  get first_name() {
    return this.signupForm.get('first_name');
  }
  get last_name() {
    return this.signupForm.get('last_name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get phone_number() {
    return this.signupForm.get('phone_number');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get business_name() {
    return this.signupForm.get('business_name');
  }
  get business_type() {
    return this.signupForm.get('business_type');
  }
  get business_logo() {
    return this.signupForm.get('business_type');
  }
}
