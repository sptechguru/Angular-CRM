
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
@Component({
  selector: 'app-sk-list',
  templateUrl: './sk-list.component.html',
  styleUrls: ['./sk-list.component.css']
})
export class SkListComponent implements OnInit {
  queryObject: any;
  isListLoading: boolean = false;
  pageSize: number = 10;
  page: number;
  offset: any;
  dataList: Array<any> = [];
  totalQueryableData: number = 0;
  isStatusBtnEnabled: boolean = false;
  productname:any;
  constructor(
    public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService,
    private _localStorage: StorageAccessorService,
    private router: Router
  ) { }

  ngOnInit(): void {
  
    // if(JSON.parse(this._localStorage.getPage.productManagement) != null)
    // {
    //   this.queryObject = JSON.parse(this._localStorage.getPage.productManagement);
    // }else{
      this.queryObject = {
        page:1,
        search_text: "",
      };
      this._localStorage.setPage = { productManagement: JSON.stringify(this.queryObject) };

   // }
    
    
    this.getAllProductList(this.queryObject);
  }
  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
    this.getAllProductList(this.queryObject);
  };
  getAllProductList(data) {
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.PRODUCT_LIST;
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
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            console.log(this.dataList)
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
      this.getAllProductList(this.queryObject);
    }
  };
  navigateToedit(prodid:any)
  {
   // this.router.navigateByUrl('/new-Sku/:prodid')
    this.router.navigate(['crm/inventory-management/sku-management/update', prodid]);
  }
  changereason(event:any)
  {
    
  }


}
