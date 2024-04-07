import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogHandlerService } from 'app/shared/components/confirmation-dialog/confirmation-dialog-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';

@Component({
  selector: 'app-catalogue-products',
  templateUrl: './catalogue-products.component.html',
  styleUrls: ['./catalogue-products.component.css']
})
export class CatalogueProductsComponent implements OnInit {

  constructor(
    private _api: ApiHandlerService,
    private _toaster: ToasterService,
    private _dialog: ConfirmationDialogHandlerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getProduct(id)
  }
  productList: Array<any>;
  getProduct(id) {
    this.productList = [];

    this._api.apiPost(API.CRM_ENDPOINTS.GET_FILTER_PRODUCT, { category_ids: [id] }).subscribe({
      next: next => {
        // console.log(next);
        this.productList = next.data.rows

        let id = this.productList.map(data => {
          return data.product_variants.map(x => {
            // console.log();

            return x;
          })
        }) as any;
        this.productList = id.flat(1);
        console.log(this.productList);


      },
      error: err => {
        // console.log(err);

      },
      complete: () => {

      }
    })
  }

}
