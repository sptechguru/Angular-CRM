import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent implements OnInit {
constructor(
    private apiHandlerService: ApiHandlerService, public dialogRef: MatDialogRef<BottomSheetComponent>) {}
    androidVersion
    crmVersion
    resellerVersion
    editAndroidVersion = false
    editCrmVersion = false
    editResellerVersion = false

  openLink(event: MouseEvent): void {
    // this._bottomSheetRef.dismiss();
    // event.preventDefault();

  }

   getApkVersion(app_type : 'android' | 'reseller' | 'crm'){
        this.apiHandlerService.apiGet(API.USER_ENDPONTS.APK_VERSION ,{app_type}).subscribe({
            next:next=>{
               // console.log(next);
               
                 if(app_type === 'android') {this.androidVersion = next.data[app_type]}
                 if(app_type === 'crm') {this.crmVersion = next.data[app_type]}
                 if(app_type === 'reseller') {this.resellerVersion = next.data[app_type]}
                
            },
            error:err=>{
                // console.log(err);
                
            }
        })
    }


     updateApkVersion(app_type : 'android' | 'reseller' | 'crm' , app_version){
        this.apiHandlerService.apiPost(API.CRM_ENDPOINTS.UPDATE_APK_VERSION ,{app_type,app_version}).subscribe({
            next:next=>{
               // console.log(next);
               this.getApkVersion(app_type)
                //  if(app_type === 'android') {this.androidVersion = next.data[app_type]}
                //  if(app_type === 'crm') {this.crmVersion = next.data[app_type]}
                //  if(app_type === 'reseller') {this.resellerVersion = next.data[app_type]}
                
            },
            error:err=>{
                // console.log(err);
                
            }
        })
    }
  ngOnInit(){
this.getApkVersion('android')
this.getApkVersion('crm')
this.getApkVersion('reseller')
  }
 
}
