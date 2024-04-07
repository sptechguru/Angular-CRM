import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { CreateNotificationComponent } from '../create-notification/create-notification.component';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { CropImageComponent } from '../slider/crop-image/crop-image.component';
import { FormControl, Validators } from '@angular/forms';
function clearFileInput(ctrl) {
  try {
    ctrl.value = null;
  } catch (ex) { }
  if (ctrl.value) {
    ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
  }
}

const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
@Component({
  selector: 'app-blockbanner',
  templateUrl: './blockbanner.component.html',
  styleUrls: ['./blockbanner.component.css'],
  providers: [ConfirmationDialogHandlerService]
})
export class BlockbannerComponent implements OnInit {

  constructor(
    private _api: ApiHandlerService,
    private _toaster: ToasterService,
    private _dialog: ConfirmationDialogHandlerService,
    public dialog: MatDialog
  ) { }

  fileToUpload: File = null;
  fileTouploads: File= null;
  loadingROAD = false;
  formDatas:FormData;
  

  devices: 'web' | 'ios' | 'android' = 'android';
  
  public roadRedirectUrl = new FormControl('', [Validators.pattern(urlRegex),Validators.required]);
  ngOnInit(): void {
    this.getRoadBanner();
  }
  roadBannerImage;
  roadBannerImageUrl;
  
  getRoadBanner(){
    const url = API.CRM_ENDPOINTS.GET_ROAD_BANNER;
    let payload={
      offset:0,
      limit:10
    }
    this._api.apiGet(url,payload).subscribe({
      next: next => {
        console.log("dta",next);
        this.roadBannerImage = next.data?.rows[0].banner_image;
        this.roadBannerImageUrl = next.data?.rows[0].banner_url
       
      }
    })
  }
  handleFileInputRoad(files) {
    if (files.target.files.length === 0) return clearFileInput(document.getElementById("myFileInput"));
this.fileToUpload=files.target.files[0];
    this.dialog.open(CropImageComponent, {
      data: { files, type: {height: 400, width: 670} },
      width: '100%',
      panelClass: 'crop-image-dialog'
    }).afterClosed().subscribe(data => {
      
      files = null
      if (data) this.fileToUpload = data
      else clearFileInput(document.getElementById("myFileInputRoad"));
    })
    // this.fileToUpload = files.item(0);
  }
  uploadFileRoad(devices: 'web' | 'ios' | 'android') {
   
    
    if (!this.fileToUpload) return;   
    const endpoint = API.CRM_ENDPOINTS.ROAD_BLOCKER_IMAGE;
    this.loadingROAD = true
    this.formDatas= new FormData();
    this.formDatas.append('banner_image', this.fileToUpload);
    this.formDatas.append('banner_url', this.roadRedirectUrl.value);  
    this._api.apiPost(endpoint,  this.formDatas, {}, { contentType: { isFormDataContent: true } }).subscribe({
      next: next => {        
        this._toaster.Success(next.message)
        clearFileInput(document.getElementById("myFileInput"));          
        this.fileToUpload = null;  
            
        this.roadRedirectUrl.reset();
        
        this.loadingROAD = true      
      },
      error: err => {
        // console.log(err)
        this.loadingROAD = false

      },
      complete: () => {

      }
    })
  }

}
