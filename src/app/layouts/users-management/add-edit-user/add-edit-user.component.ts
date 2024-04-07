import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserFormFieldsModel } from '../models/user-form-fields.model';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeoutError } from 'rxjs';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { UserTypeValidator, getFormValidationErrors } from 'app/shared/custom/customValidation';

@Component({
  selector: 'add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  addUserForm: FormGroup;
  private initData: UserFormFieldsModel = {
    first_name: '',
    last_name: '',
    email: '',
    user_type: '',
    package_id: '',
    company_name: '',
    services: [],
    operating_countries: []
  };
  userTypes: Array<object> = [
    {
      label: 'Customer',
      user_type: 'customer',
    },
    {
      label: 'Service Provider',
      user_type: 'service_provider',
    }
  ];
  private operatingCountries: Array<object> = [
    {
      "name": "United States",
      "iso_code": "USA"
    },
    {
      "name": "Ghana",
      "iso_code": "GHA"
    },
    {
      "name": "Nigeria",
      "iso_code": "NGA"
    }
  ];
  private providedServices: Array<string> = [
    "Land Services",
    "Air Services",
    "Ocean Services"
  ];
  private packageList: Array<object> = [];
  private id: string;
  public isPackagesLoading: boolean = false;
  public isUserProcessing: boolean = false;
  private serviceProviderFeilds: FormGroup = this.fb.group({
    package_id: [
      this.initData.package_id,
      Validators.required
    ],
    company_name: [
      this.initData.company_name,
      Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])
    ],
    services: [
      this.initData.services,
      Validators.compose([
        Validators.required,
        UserTypeValidator
      ])
    ],
    operating_countries: [this.initData.operating_countries, Validators.required]
  });


  constructor(
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
  ) { }

  ngOnInit() {
    this.getAllSubscriptionList();
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
      } else {
        this.createForm();
      }
    });
  }

  createForm(): any {
    let userFormGroupStructure = {
      first_name: [
        this.initData.first_name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[A-za-z\s]+$/)
        ])
      ],
      last_name: [
        this.initData.last_name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[A-za-z\s]+$/)
        ])
      ],
      email: [
        this.initData.email,
        Validators.compose([
          Validators.required,
          Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)
        ])
      ],
      user_type: [
        this.initData.user_type,
        Validators.compose([
          Validators.required
        ])
      ]
    };
    // if (!this.id) {
    //   userFormGroupStructure['password'] = [
    //     this.initData.password,
    //     Validators.compose([
    //       Validators.required,
    //       Validators.minLength(8),
    //       Validators.maxLength(16)
    //     ])
    //   ];
    // }

    this.addUserForm = this.fb.group(userFormGroupStructure);
    this.updateForm();
  }

  updateForm() {
    this.user_type.valueChanges.subscribe(val => {
      if (val && (val == 'service_provider')) {
        this.addUserForm.addControl('package_id', this.fb.control(
          this.initData.package_id,
          [Validators.required]
        ));
        this.addUserForm.addControl('company_name', this.fb.control(
          this.initData.company_name,
          Validators.compose([
            Validators.required,
            Validators.maxLength(20)
          ])
        ));
        this.addUserForm.addControl('services', this.fb.control(
          this.initData.services,
          Validators.compose([
            Validators.required,
            UserTypeValidator
          ])
        ));
        this.addUserForm.addControl('operating_countries', this.fb.control(
          this.initData.operating_countries,
          Validators.compose([
            Validators.required
          ])
        ));
        this.addUserForm.get('package_id').markAsPristine();
        this.addUserForm.get('company_name').markAsPristine();
        this.addUserForm.get('services').markAsPristine();
        this.addUserForm.get('operating_countries').markAsPristine();
      } else {
        this.addUserForm.removeControl('package_id');
        this.addUserForm.removeControl('company_name');
        this.addUserForm.removeControl('services');
        this.addUserForm.removeControl('operating_countries');
      }
    });

    // this.addUserForm.addControl('nationality', this.fb.control('', [Validators.required]));
  }

  getAllSubscriptionList() {
    this.isPackagesLoading = true;
    const url = API.AUTH_ENDPOINTS.SUBSCRIPTION_LIST;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result: any) => {
        let resultData = result.data;
        if (resultData && resultData.length) {
          this.packageList = resultData;
          this.packageList = this.packageList.concat();
        } else {
          this.packageList = [];
        }
      },

      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      },

      complete: () => {
        // setTimeout(() => {
        this.isPackagesLoading = false;
      }
    });
  }

  // getDetails(id = null) {
  //   if (id) {
  //     this.manageUserService.getUserDetails(id).subscribe({
  //       next: (data) => {
  //         // console.log('data : ', data);
  //         if (data.success && data.data) {
  //           let userDetails = Object.assign({}, data.data);
  //           Object.keys(userDetails).forEach((field) => {
  //             if (this.addUserForm.controls[field]) {
  //               this.addUserForm.controls[field].setValue(userDetails[field]);
  //             }
  //           });
  //         } else {
  //           this.toasterService.Error(data.message);
  //         }
  //       },
  //       error: (err) => {
  //         if (err.error && err.error.message) {
  //           this.toasterService.Error(err.error.message);
  //         } else {
  //           this.toasterService.Error('Server not responding.');
  //         }
  //       },
  //       complete: () => { }
  //     });
  //   } else {
  //     this.toasterService.Error('Missing user info !');
  //   }
  // };

  onSubmit() {
    if (!this.isUserProcessing && this.addUserForm.valid) {
      this.isUserProcessing = true;
      const formVal = this.addUserForm.value;
      const url = API.ADMIN_USER_ENDPOINTS.ADD_USER;
      let addUserData = Object.assign({}, this.addUserForm.value);
      this.apiHandlerService.apiPost(url, addUserData).subscribe({
        next: (data) => {
          if (data.success) {
            this.router.navigate(['/crm/users-management']);
            this.toasterService.Success('User added successfully.');
          } else {
            if (data.error && data.error.message) {
              this.toasterService.Error(data.error.message);
            } else if (data.error && (data.error.length > 0)) {
              data.error.forEach(erroObj => {
                this.toasterService.Error(erroObj.msg);
              });
            } else {
              this.toasterService.Error('Something went wrong.');
            }
          }
        },
        error: (err) => {
          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        },
        complete: () => {
          this.isUserProcessing = false;
        }
      });
    } else {
      // if form is not valid
      Object.keys(this.addUserForm.controls).forEach(field => {
        const control = this.addUserForm.get(field);
        if (control.status == 'INVALID') {
          control.markAsDirty({ onlySelf: true });
          control.markAsTouched({ onlySelf: true });
        }
      });
      this.toasterService.Error('Please enter all required fields');
    }
  };

  get first_name() {
    return this.addUserForm.get('first_name') as FormControl;
  };

  get last_name() {
    return this.addUserForm.get('last_name') as FormControl;
  };

  get email() {
    return this.addUserForm.get('email') as FormControl;
  };

  get user_type() {
    return this.addUserForm.get('user_type') as FormControl;
  };

  get package_id() {
    return this.addUserForm.get('package_id') as FormControl;
  };

  get company_name() {
    return this.addUserForm.get('company_name') as FormControl;
  };

  get services() {
    return this.addUserForm.get('services') as FormControl;
  };

  get operating_countries() {
    return this.addUserForm.get('operating_countries') as FormControl;
  };
}
