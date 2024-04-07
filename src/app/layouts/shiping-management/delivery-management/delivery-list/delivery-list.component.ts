import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css']
})
export class DeliveryListComponent implements OnInit {
  isListLoading: boolean = false;
  queryObject: any; 
  pageSize: number = 10;
  page: number;
  offset: any;
  dataList: Array<any> = [];
  totalQueryableData: number = 0;
  isStatusBtnEnabled: boolean = false;
  constructor(
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService, 
    private _localStorage: StorageAccessorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.queryObject = JSON.parse(this._localStorage.getPage.productManagement);
    console.log(this.queryObject);
    this.getcourierdetail(this.queryObject);
  }

  getcourierdetail(data)
  {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.Delivery_List;
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
          console.log(result)
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            console.log(result)
           // this.dataList = this.dataList.concat();
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
  handlePageChange(newPage) {
    if(newPage){
      this.queryObject.page = newPage;
      this.getcourierdetail(this.queryObject);
    }
  };

}
