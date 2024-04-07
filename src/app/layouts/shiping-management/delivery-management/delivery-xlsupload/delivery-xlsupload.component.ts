import { Component, OnInit } from '@angular/core';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-delivery-xlsupload',
  templateUrl: './delivery-xlsupload.component.html',
  styleUrls: ['./delivery-xlsupload.component.css']
})
export class DeliveryXlsuploadComponent implements OnInit {

  rowObject;
  fileName="";
  constructor(
    public toasterService: ToasterService, 
    public apiHandlerService: ApiHandlerService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }
  onChangeFile(fileList: FileList){
    console.log("data",fileList);
    let file = fileList[0];
    this.fileName=file.name;
    if (file) {
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        workbook.SheetNames.forEach(sheet => {
          this.rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        });
       
      }
    }

  }

  upload()
  {
    if(!this.rowObject){
      this.toasterService.Error('', 'Please Upload XlS File');
      return ;     
     }
     this.spinner.show();
     let url=API.CRM_ENDPOINTS.Delivery_BULK_UPLOAD;    
     this.apiHandlerService.apiPost(url,this.rowObject,{}).subscribe({
      next: (data) => {       
        this.spinner.hide();
        console.log("DAta",data)
        if (data.success) {         
          this.fileName="";
          this.fileName=null;
          this.rowObject=undefined;
          this.toasterService.Success(data.message);
        }else
        {
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
        this.spinner.hide();
        if (typeof err == 'string') {
          this.toasterService.Error(err);
        } else if (err.error && err.error.message) {
          this.toasterService.Error(err.error.message);
        }        
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

}
