import { Component, ElementRef, OnInit } from '@angular/core';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import * as XLSX from 'xlsx';
import { API } from 'app/shared/constants/endpoints';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
@Component({
  selector: 'app-sku-xlsupload',
  templateUrl: './sku-xlsupload.component.html',
  styleUrls: ['./sku-xlsupload.component.css']
})
export class SkuXlsuploadComponent implements OnInit {
  fileName = "";
  rowObject;
  constructor(
    public toasterService: ToasterService,
    private spinner: NgxSpinnerService, public apiHandlerService: ApiHandlerService,
    private _FileSaverService: FileSaverService
  ) { }

  ngOnInit(): void {
  }
  onChangeFile(fileList: FileList) {
    // console.log("data",fileList);
    let file = fileList[0];
    this.fileName = file.name;
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
  upload() {
    if (!this.rowObject) {
      this.toasterService.Error('', 'Please Upload XlS File');
      return;
    }
    this.spinner.show();
    let url = API.CRM_ENDPOINTS.SKU_BULK_UPDATE;
    this.apiHandlerService.apiPost(url, this.rowObject, {}).subscribe({
      next: (data) => {
        this.spinner.hide();
        if (data.success) {
          this.fileName = "";
          this.fileName = null;
          this.rowObject = undefined;
          this.toasterService.Success(data.message);
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

  getSampleXLSFields() {
    const url = API.CRM_ENDPOINTS.PRODUCT_SAMPLE_FIELD_XLS + '/' + 'adjustment';
    this.spinner.show();
    this.apiHandlerService.apiGet(url, {}).subscribe((res) => {
      // console.log(res.data.link); 
      window.open(res.data.link, '_blank');
      this.spinner.hide();
      this.toasterService.Success(res.message);
    }, error => {
      this.toasterService.Error(error);
    })
  }


}
