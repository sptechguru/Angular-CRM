import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';
import { AddCollectionComponent } from './add-collection/add-collection.component';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
  providers:[ConfirmationDialogHandlerService]
})
export class CollectionComponent implements OnInit {
  queryObject: any;
  dataList: Array<any> = [];
  loading: boolean;
  totalQueryableData: number = 0;
  pageSize: number = 10;
  page: number;
  isListLoading: boolean = false;
  status: any;
  offset: any;
  constructor(private _dialog: ConfirmationDialogHandlerService,public dialog: MatDialog,
    public apiHandlerService: ApiHandlerService,public toasterService: ToasterService) { }

  ngOnInit(): void {
    this.queryObject = {
      page: 1,
      search_text: "",
    };
    this.getAllCollectionList(this.queryObject);
  }
  searchUserByQuery(query = '') {
    this.queryObject.search_text = query;
    this.queryObject.page = 1;
  };
  openDialog() {
    const dialog = this.dialog.open(AddCollectionComponent).afterClosed().subscribe(response => {
      if (response) {
        this.getAllCollectionList(this.queryObject);
      }
    });
  }
  getAllCollectionList(data){
    if (!this.isListLoading) {
      this.isListLoading = true;
      const url = API.CRM_ENDPOINTS.COLLECTION_LIST;
      const limit = this.pageSize || 10;
      console.log(limit);
      let pageObj={limit:limit,offset:(data.page - 1) * limit};
      this.offset = (data.page - 1) * limit;
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          if (resultData.rows && resultData.rows.length) {
            this.dataList = resultData.rows;
            console.log(result);
            this.dataList = this.dataList.concat();
          } else {
            this.dataList = [];
          }
          this.totalQueryableData = resultData.total;
          if (data.page) {
            this.page = data.page;
          } else {
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
        }
      });
    } 
  }

  deleteCollection(collection) {
    this._dialog.openDialog({ title: 'Delete Collection', cancelText: 'Cancel', confirmText: 'Delete', question: 'Are sure you want to delete Collection?' }).subscribe(response => {
      if (!response) return;
      this.apiHandlerService.apiPost(API.CRM_ENDPOINTS.DELETE_COLLECTION(collection.id),{}).subscribe({
        next: next => {
          console.log(next);
          this.toasterService.Success(next.message)
          this.getAllCollectionList(this.queryObject);
        },
        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
        }
      })
      
    })
  }

  EditCollection(data) {
    const dialog = this.dialog.open(AddCollectionComponent,{data:data}).afterClosed().subscribe(response => {
      if (response) {
        this.getAllCollectionList(this.queryObject);
      }
    });
   }

   handlePageChange(newPage) {
    if (newPage) {
      this.queryObject.page = newPage;
      
    }
  };

}
















