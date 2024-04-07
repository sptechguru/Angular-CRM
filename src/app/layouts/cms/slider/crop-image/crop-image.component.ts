import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.css']
})
export class CropImageComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CropImageComponent>,) {
    console.log(data.type);

    this.fileChangeEvent(data.files)
  }
  imageChangedEvent: any;
  croppedImage: any;


  fileChangeEvent(event: any): void {


    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {


    this.croppedImage = base64ToFile(event.base64)
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }


  save() {
    this.dialogRef.close(this.croppedImage)
  }


}
