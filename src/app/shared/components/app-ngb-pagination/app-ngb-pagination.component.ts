import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { environment } from "environments/environment";

@Component({
  selector: "app-ngb-pagination",
  templateUrl: "./app-ngb-pagination.component.html",
})
export class AppNgbPaginationComponent implements OnInit {

  @Input() collectionSize: number;
  _pageSize: number = 10;

    pageEvent: PageEvent;

  @Input()
  set pageSize(pageSize: number) {
    this._pageSize = (pageSize) ? pageSize : this._pageSize;
  }

  @Input() page: number;

  @Input() isDisabled: boolean;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  pageIndex :number
  maxSize = 5;
  bigTotalItems = 175;
  bigCurrentPage = 1;

  constructor() {
    this._pageSize = (environment.appConfig && environment.appConfig.defaultPageSize) ? environment.appConfig.defaultPageSize : 10;
  }

  ngOnInit() {
   
  }
  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.pageIndex = this.page
    
  }
  ngOnChanges(changes: SimpleChanges): void {
   if(changes.page) {
     // console.log('changes.page.currentValue',changes.page.currentValue);
     
     this.pageIndex= changes.page.currentValue
   }
    
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  }

  emitPageChange(event ) {
    this.page = event.page;
    this.pageChange.emit(event.page);
  }

}
