import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateNotificationComponent } from 'app/layouts/cms/create-notification/create-notification.component';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-create-catelog',
  templateUrl: './create-catelog.component.html',
  styleUrls: ['./create-catelog.component.css']
})
export class CreateCatelogComponent implements OnInit {

  constructor(
    private _api: ApiHandlerService,
    private toaster: ToasterService,
    public dialogRef: MatDialogRef<CreateNotificationComponent>,
  ) { }

  ngOnInit(): void {
  }
  saving = false;
  imageToUpload: File;
  name:string;

  handleFileInput(files: FileList) {
    this.imageToUpload = files.item(0);
  }

  createNotification(form: NgForm) {
    const endpoint = API.CRM_ENDPOINTS.CREATE_CATELOG;
    if (form.invalid) return;
    this.saving = true;
    const formData: FormData = new FormData();
    if (this.imageToUpload) {
      formData.append('catalogue_image', this.imageToUpload, this.imageToUpload.name);
    }
    formData.append('catalogue_name', this.name);
  
    
    
    this._api.apiPost(endpoint, formData, {}, { contentType: { isFormDataContent: true } }).subscribe({
      next: next => {
        // console.log(next);
        this.toaster.Success(next.message)
        this.dialogRef.close(true);
        this.saving = false;

      },
      error: err => {
        // console.log(err)
        this.toaster.ErrorTimeOut(err)

        this.saving = false;
      },
      complete: () => {
        this.saving = false;

      }
    })



  }

}
