import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API } from 'app/shared/constants/endpoints';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { ToasterService } from 'app/shared/services/toaster.service';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-view-ready-stock',
  templateUrl: './view-ready-stock.component.html',
  styleUrls: ['./view-ready-stock.component.css']
})
export class ViewReadyStockComponent implements OnInit {
 readyStock;
 id;
 statelist='';
 isListLoading=false;
  constructor(private activateRoute:ActivatedRoute, public apiHandlerService: ApiHandlerService,
    public toasterService: ToasterService) { }

  ngOnInit(): void {
    console.log(this.activateRoute.snapshot.params['id']);
    this.id=this.activateRoute.snapshot.params['id'];
    this.getAllProductList(this.id);
  }

  getAllProductList(data) {
    this.isListLoading=true;
      const url = API.SHIPING_ENDPOINTS.GET_READY_STOCKBYID(data);
      let pageObj = {   };
      this.apiHandlerService.apiGet(url, pageObj).subscribe({
        next: (result: any) => {
          let resultData = result.data;
          console.log(result);
          this.isListLoading = true;
          this.readyStock = resultData;
          console.log(result.data.shipping_states);
          for(let i=0;i<result.data.shipping_states.length;i++){
            this.statelist+=result.data.shipping_states[i].name+',';

          }
          this.statelist=this.statelist.slice(0,this.statelist.length-1);
        },

        error: err => {
          if (err instanceof TimeoutError) {
            this.toasterService.Error('', 'Timeout Error');
          }
          this.isListLoading = false;
        },

        complete: () => {
          this.isListLoading = true;
        }
      });
    }
  }

