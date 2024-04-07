import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ROUTES } from 'app/components/sidebar/sidebar.component';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-view-crm-user-details',
  templateUrl: './view-crm-user-details.component.html',
  styleUrls: ['./view-crm-user-details.component.css'],
  providers: [ConfirmationDialogHandlerService],
})
export class ViewCrmUserDetailsComponent implements OnInit {

  constructor(
    private _api : ApiHandlerService,
    private route : ActivatedRoute,
    private toast : ToasterService,
      public storage : StorageAccessorService,
      
       private ConfirmationDialogHandlerService: ConfirmationDialogHandlerService

  ) { }
permission = new FormControl([]);

permissionSpinner = false
  id;
  userData;
  menulist;

  
  dataList: Array<any> = [];
  new_status: string;
  loading: boolean
  sortByStatusObject: any;
  sortByUserTypeObject: any;
  queryObject: any;
  queryObjectResellar: any;
  userService: any;
  totalQueryableData: number = 0;
  totalQueryableDataResellar: number = 0;
  pageSize: number = 10;
  dataListResellar: Array<any> = [];
  page: number;
    pageReseller: number;
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  currentPage: any;
  offset: any;
  offsetReseller: number;

 

 
    t

  getAllCrmUserList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const id = this.route.snapshot.paramMap.get('id');
      const url = API.CRM_ENDPOINTS.CRM_SUB_USER(id);
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      this.offset = (data.page - 1) * limit;
      if (data.sortFied && data.orderBy) {
        pageObj['sort_field'] = data.sortFied;
        pageObj['order_by'] = data.orderBy;
      }
      this._api.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows) {
            this.dataList = resultData.rows;
            // console.log( this.dataList);
            
            this.dataList = this.dataList.concat();
          } else {
            this.dataList = [];
          }
          this.totalQueryableData = resultData.total;
          if(data.page){
            this.page = data.page;
          }else{
            this.page = 1;
          }
          this.isListLoading = false;
        },
        error: err => {
          if (err instanceof TimeoutError) {
            this.toast.Error('', 'Timeout Error');
          }
          this.isListLoading = false;
        },
        complete: () => {
          this.isListLoading = false;
          this.isStatusBtnEnabled = true;
        }
      });
    }
  }

  getCrmAssignReseller(data) {
     const id = this.route.snapshot.paramMap.get('id');
     const url = API.CRM_ENDPOINTS.CRM_USER_ASSIGN_RESELLER(id);
      const limit = this.pageSize || 10;
      let pageObj = {
        search_text: data.search_text
      };
      pageObj['limit'] = limit;
      pageObj['offset'] = (data.page - 1) * limit;
      this.offsetReseller = (data.page - 1) * limit;
      if (data.sortFied && data.orderBy) {
        pageObj['sort_field'] = data.sortFied;
        pageObj['order_by'] = data.orderBy;
      }

     this._api.apiGet(url,pageObj).subscribe(
       {
         next:result=>{
             let resultData = result.data;
          if (resultData.rows) {
            this.dataListResellar = resultData.rows;
            // console.log( this.dataList);
            
            this.dataListResellar = this.dataListResellar.concat();
          } else {
            this.dataListResellar = [];
          }
          this.totalQueryableDataResellar = resultData.total;
          if(data.page){
            this.pageReseller = data.page;
          }else{
            this.pageReseller = 1;
          }
         },
         error:error=>{
         if (error instanceof TimeoutError) {
            this.toast.Error('', 'Timeout Error');
          }
         },
       }
     )
  }

  removeResellarFromUser(reseller_id){
    console.log(reseller_id);
    
    this.ConfirmationDialogHandlerService.openDialog({
      question: "Are sure you want to remove" + reseller_id.user.email + "?",
      confirmText: "Yes",
      cancelText: "No",
    }).subscribe((result) => {
      if (result) {
 const payLoad = {crm_id:this.route.snapshot.paramMap.get('id'),reseller_id:reseller_id.fk_user_id};
    const url = API.CRM_ENDPOINTS.REMOVE_RESELLAR_FROM_USER
    this._api.apiPost(url,{},payLoad).subscribe({
         next: (data) => {
              if (data.success) {
                if (this.queryObjectResellar.page) {
                  this.queryObject = {
                    page: this.queryObjectResellar.page,
                    search_text: "",
                  };
                } else {
                  this.queryObjectResellar = {
                    page: 1,
                    search_text: "",
                  };
                }
                this.getCrmAssignReseller(this.queryObjectResellar);
                this.toast.Success(data.message);
              } else {
                if (data.error && data.error.message) {
                  this.toast.Error(data.error.message);
                } else if (data.error && data.error.length > 0) {
                  data.error.forEach((erroObj) => {
                    this.toast.Error(erroObj.msg);
                  });
                } else {
                  this.toast.Error("Something went wrong.");
                }
              }
            },
            error: (err) => {
              if (typeof err == "string") {
                this.toast.Error(err);
              } else if (err.error && err.error.message) {
                this.toast.Error(err.error.message);
              }
            },
        
    })
      }});
   


  }

  sortUserByStatus(status = '') {
    this.queryObject.page = 1;
    this.queryObject.query['status'] = status;
    this.getAllCrmUserList(this.queryObject);
  };

  sortUserByType(user_type = '') {
    this.queryObject.page = 1;
    this.queryObject.query['user_type'] = user_type;
    this.getAllCrmUserList(this.queryObject);
  };

  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getAllCrmUserList(this.queryObject);
    }
  };

  ngOnInit(): void {
    this.getUserProfile()
    // this.getMenuData()
    this.queryObject = {
      page: 1,
      search_text: '',
    }
    this.queryObjectResellar = {
      page: 1,
      search_text: '',
    }
    this.getAllCrmUserList(this.queryObject);
    this.getCrmAssignReseller(this.queryObjectResellar);
  


    
  }

toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
  getMenuData(){
    this.permissionSpinner = true
    this._api.apiGet(API.CRM_ENDPOINTS.PERMMISION_LIST ).subscribe({
      next:result=>{
        if(!result.success) return;
        // this.userData =result.data
        // // console.log(result.data.rows)
        const list   = result.data.rows;
       this.menulist = list.map(data=>{
          return{...data , menu_name : data.menu_name.replace(/-/g, ' ')}
        })
      },
      error:err=>{
        // console.log(err);
    this.permissionSpinner = false

        
      },
      complete:()=>{
    this.permissionSpinner = false

      }
    })
  }

  getElementIsChecked(id){
   return this.permission.value.includes(id)
  }

    searchResellarByQuery(query = '') {
    this.queryObjectResellar.search_text = query;
    this.queryObjectResellar.page = 1;
    this.getCrmAssignReseller(this.queryObjectResellar);
  };
   searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllCrmUserList(this.queryObject);
  };

  onChangePermission(event, id){
    let array =  [...this.permission.value]
    if(event.checked){
      if(this.permission.value.includes(id))return
      array.push(id)
      this.permission.patchValue(array) 
    }else{
      if(!this.permission.value.includes(id))return
      array = array.filter(item => item !== id)
      this.permission.patchValue(array)
    }
    
  }

  updatePermission(){
    const id = this.route.snapshot.paramMap.get('id');
    this._api.apiPost(API.CRM_ENDPOINTS.ADD_PERMISSION_TO_CRM_USER,{user_id:id,menu_id:this.permission.value}).subscribe({
      next:next=>{
        this.getUserProfile()
        this.toast.Success(next.message)
      },
      error:err=>{
        this.toast.Error(err.error.message)
      },
      complete:()=>{

      }
    })
  }

  getUserProfile(){
    const id = this.route.snapshot.paramMap.get('id');
    // console.log(id);
    
    this._api.apiGet(API.USER_ENDPONTS.USER_DETAILS(id)).subscribe({
      next:result=>{
        if(!result.success) return;
        this.userData =result.data
        // let permission = [];
        // result.data.permission_managements.map(data=>{
        //   permission.push(data.menu_management_id)
        // })
        // console.log(permission);
        
        // this.permission.patchValue(permission)
        // // console.log()
      },
      error:err=>{
        // console.log(err);
        
      },
      complete:()=>{

      }
    })
  }

}
