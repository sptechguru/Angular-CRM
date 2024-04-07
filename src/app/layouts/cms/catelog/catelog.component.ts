import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-catelog',
  templateUrl: './catelog.component.html',
  styleUrls: ['./catelog.component.css']
})
export class CatelogComponent implements OnInit {

  constructor(
    private _api: ApiHandlerService,
    private dialog: ConfirmationDialogHandlerService,
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) { }


  categories: Array<any>;
  ngOnInit(): void {
    this.getProductCategories('');
  }

  getProductCategories(search_text) {
    const limit = 100;
    let pageObj = {
      search_text: search_text,
    };
    pageObj["limit"] = limit;
    pageObj["offset"] = 0;
    this._api.apiGet(API.CRM_ENDPOINTS.CATEGORY_LIST, pageObj).subscribe({
      next: next => {

        this.categories = next.data.rows
        // console.log(this.categories);
      },
      error: err => {
        // console.log(err);

      },
      complete: () => {

      }
    })
  }

}
