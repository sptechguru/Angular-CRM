import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { DialogData } from 'app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-cancel-order-model',
  templateUrl: './cancel-order-model.component.html',
  styleUrls: ['./cancel-order-model.component.css']
})
export class CancelOrderModelComponent  {

    constructor(
    public dialogRef: MatDialogRef<CancelOrderModelComponent>,
      public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
     public ConfirmationDialogHandlerService: ConfirmationDialogHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) 
    {
     this.orderdata = data
      
    }

    orderdata :any
    reason = ""

  onNoClick(): void {
    this.dialogRef.close();
  }
 cancel(data): void {
   if(this.reason.length === 0){
     this.toasterService.Error('Reason is requried');
     return
   }
    this.dialogRef.close(data);
  }

  

  

}
