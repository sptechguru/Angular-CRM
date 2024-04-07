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
  selector: 'app-create-product-xls',
  templateUrl: './create-product-xls.component.html',
  styleUrls: ['./create-product-xls.component.css']
})
export class CreateProductXlsComponent implements OnInit {
  fileName="";
  rowObject;
  list={product:[],variant:[]};
  constructor(public toasterService: ToasterService, 
     private spinner: NgxSpinnerService,public apiHandlerService: ApiHandlerService,
     private _FileSaverService: FileSaverService) { }

  ngOnInit(): void {
    
  }
  onChangeFile(fileList: FileList){
    console.log(fileList);
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
        console.log(this.rowObject);
      }
    }

  }

  tabClick(data){
   console.log(data);
   this.fileName="";
   this.rowObject=undefined;
  }
 
  getSampleXLS(data,type,link:HTMLAnchorElement){
    console.log(data);
    this.productSampleXLS(type,link,data)
  }

  productSampleXLS(type,link:HTMLAnchorElement,data){
    console.log(link);
    this.spinner.show();
    const url =type ? ( data=='product' || data=='variant' ? API.CRM_ENDPOINTS.PRODUCT_SAMPLE_FIELD_XLS+'/'+data : API.CRM_ENDPOINTS.PRODUCT_SAMPLE_FIELD_XLS) : API.CRM_ENDPOINTS.PRODUCT_SAMPLE_XLS+'/'+data;
    this.apiHandlerService.apiGet(url,{}).subscribe({
      next: (result: any) => {
        //console.log(result);
        window.open(result.data.link,'_blank');
        this.spinner.hide();
        this.toasterService.Success(result.message);
      },
      error: err => {
        if (err instanceof TimeoutError) {
          this.toasterService.Error('', 'Timeout Error');
        }
      },

      complete: () => {
        this.spinner.hide();
      }
    });
  }

  upload(data){
  console.log(data);
  let url;
  switch(data){
    case 'product':
    url=API.CRM_ENDPOINTS.PRODUCT_ADD_BULK;
    this.createBulk(data,url)
    break;
    case 'variant':
    url=API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_EXCEL_ADD;
    this.createBulk(data,url)
    break;
    case 'offerprice':
    url=API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_OFFER;
    this.createBulk(data,url)
    break;
    case 'leadtime':
    url=API.CRM_ENDPOINTS.PRODUCTVARIANT_BULK_LEAD;
    this.createBulk(data,url)
    break;
    default:
  }
  }

  createBulk(type,url){
   if(!this.rowObject){
    this.toasterService.Error('', 'Please Upload XlS File');
    return ;     
   }
    this.spinner.show();
      this.apiHandlerService.apiPost(url,this.rowObject,{}).subscribe({
        next: (data) => {
          console.log(data);
          this.spinner.hide();
          if (data.success) {
            this.fileName="";
            this.rowObject=undefined;
            this.toasterService.Success(data.message);
            if(type=='product' || type=='variant'){
               this.list[type]=this.list[type].concat(data.data);
            }
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
      });

  }
}
