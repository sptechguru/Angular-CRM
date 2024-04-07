import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { DialogData } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Observable, TimeoutError } from 'rxjs';

@Component({
  selector: 'app-assign-to-user',
  templateUrl: './assign-to-user.component.html',
  styleUrls: ['./assign-to-user.component.css'],
   providers: [ConfirmationDialogHandlerService]
})
export class AssignToUserComponent implements OnInit {

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  isProcessing = false

  constructor(   public toasterService: ToasterService,
      @Inject(MAT_DIALOG_DATA) public data,
    private ConfirmationDialogHandlerService: ConfirmationDialogHandlerService,
public dialogRef: MatDialogRef<AssignToUserComponent>,
     public apiHandlerService: ApiHandlerService,){}
searchText:string;
   dataList: Array<any> = [];
  new_status: string;
  loading: boolean
  sortByStatusObject: any;
  sortByUserTypeObject: any;
  queryObject: any;
  userService: any;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number;
  isListLoading: boolean = false;
  isStatusBtnEnabled: boolean = false;
  currentPage: any;
  offset: any;


  ngOnInit() {
   this.queryObject = {
      page: 1,
      search_text: '',
    }
    this.getAllCrmUserList(this.queryObject);
  }


   getAllCrmUserList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.CRM_USER_LIST;
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
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
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
            this.toasterService.Error('', 'Timeout Error');
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
;

  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllCrmUserList(this.queryObject);
  };

 store(data){
   this.myControl.patchValue(data)
 }

 

  assignToUser(){
 this.ConfirmationDialogHandlerService.openDialog({
      question: 'Are sure you want to asssign reseller to \'' + this.myControl.value.email + '?',
      confirmText: 'Yes',
      cancelText: 'No'
    }).subscribe((result) => {
      if (!result) {
        this.dialogRef.close();
        return;
      }
      this.isProcessing = true;
      this.dialogRef.disableClose = true;
      const api = API.CRM_ENDPOINTS.ASSIGN_CRM_USER(this.myControl.value.id)
    this.apiHandlerService.apiPost(api,{reseller_list:[...this.data]}).subscribe({
        next: (data) => {
          if (data.success) {
            this.toasterService.Success(data.message);
            this.dialogRef.close();
          } else {
            this.toasterService.Error(data.message);
          }
         this.isProcessing = false;
        },
        error: (err) => {
          this.toasterService.Error(err.message);
            this.isProcessing = false;
        },
        complete: () => {
          
        }
      });
    
    });
      
  }

}
