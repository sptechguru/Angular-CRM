import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ERROR_MSG } from 'app/shared/constants/consts';
import { UserData, StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})

export class AuthSigninComponent implements OnInit {
  loginForm: FormGroup;
  errorMessages = ERROR_MSG;

  initialFormData = {
    email: '',
    password: ''
  };

  userLocalData: UserData;

  isLoginProcessing = false;

  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
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
    this.retrieveLoginInfo();
    // document.getElementsByTagName('body')[0].classList.add('p-0', 'loginpage');
  }


  /**
   * It tries to fetch user info from local storage
   * and fills the login form
   */
  retrieveLoginInfo() {
    this.userLocalData = this.localStorage.fetchData();
    if (this.userLocalData) {
      const formData = this.userLocalData.loginForm;
      if (formData) {
        this.email.setValue(formData.email);
        this.password.setValue(formData.password);
        // If successfully retrieved then check remember-me
        this.rememberMe.setValue(true);
        this.loginForm.updateValueAndValidity();
      }
    }
  }

  /**
   * It saves the login credentials, if remember me was checked
   * while submitting form
   */
  saveLoginInfo() {
    this.userLocalData = Object.assign({}, this.userLocalData, this.localStorage.fetchData());
    let userData: UserData | object = this.userLocalData
      ? this.userLocalData
      : {};
    if (this.rememberMe.value) {
      userData = Object.assign({}, userData, {
        loginForm: {
          email: this.email.value,
          password: this.password.value
        }
      });
    } else {
      // if remember-me is unchecked during submission, then delete stored user data
      userData = Object.assign({}, userData, {
        loginForm: {
          email: '',
          password: ''
        }
      });
    }
    this.localStorage.storeData(userData);
  }

  /**
   * It saves token into local-storage when data is received from server
   * It expects response body of {token: ''....}
   * @param serverResponse entire server response received from server
   */
  saveToken(serverResponse: any) {
    // change below if token is nested in other object
    const token = serverResponse.data.access_token;
    if (token) {
      this.localStorage.storeToken(token);
    }
  }

  storeDataInLocal(data) {
    if (data) {
      try {
        const userInfo = this.localStorage.fetchData().loginForm;
        this.localStorage.deleteData();
        this.localStorage.storeData(
          Object.assign({}, { loginForm: userInfo }, data)
        );
      } catch (ex) {
        this.localStorage.deleteData();
        this.localStorage.storeData(data);
      }
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [
        this.initialFormData.email,
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          )
        ])
      ],
      password: [
        this.initialFormData.password,
        Validators.compose([Validators.required])
      ],
      remeberMe: false
    });
  }

  handleSubmit() {
    if (this.loginForm.valid && !this.isLoginProcessing) {
      this.isLoginProcessing = true;
      const formVal = this.loginForm.value;
      this.apiHandlerService.apiPost(API.AUTH_ENDPOINTS.LOGIN_IN, { email: formVal.email, password: formVal.password, device_type: 'web', device_id: '' }).subscribe({
        next: result => {
          if (result.data && result.data.access_token) {
           if(result.data?.user_role?.role_name === 'reseller'){
              let msg = 'You are not Authorize to login';
            this.loginForm.reset();
            this.toasterService.Error(msg);
             return;
           }
            this.storeDataInLocal(result);
            this.saveToken(result);
            this.saveLoginInfo();
            this.router.navigate(['crm/dashboard']);
            this.toasterService.Success('Login Successfull');
          } else {
            let msg = (result.message) ? result.message : 'Invalid Credentials';
            this.loginForm.reset();
            this.toasterService.Error(msg);
          }
        },
        error: err => {
          let msg;
          if (err && err.error && err.error.message) {
            msg = err.error.message;
          } else if (err && err.message) {
            msg = err.message;
          }
          this.loginForm.reset();
          this.toasterService.Error(msg);
          this.isLoginProcessing = false;
        },
        complete: () => {
          this.isLoginProcessing = false;
        }
      });
    }
  }

  /* Getters for accessing reactive form elements are defined below */

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('remeberMe');
  }
}
