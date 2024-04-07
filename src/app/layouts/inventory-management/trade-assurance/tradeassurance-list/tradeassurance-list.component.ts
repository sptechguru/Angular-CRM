import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToasterService } from 'app/shared/services/toaster.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'app/shared/services/api-handler.service';
import { API } from 'app/shared/constants/endpoints';
import { temporaryDeclaration } from '@angular/compiler/src/compiler_util/expression_converter';
@Component({
  selector: 'app-tradeassurance-list',
  templateUrl: './tradeassurance-list.component.html',
  styleUrls: ['./tradeassurance-list.component.css']
})
export class TradeassuranceListComponent implements OnInit {
  closeResult: any
  addtrade: FormGroup;
  file: File;
  tradeassurancelist: any = [];
  imgeurl: any;
  productid: any;

  constructor(private modalService: NgbModal,
    public fb: FormBuilder,
    public toasterService: ToasterService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    public apiHandlerService: ApiHandlerService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.getalltrade();
    this.addtrade = this.fb.group({
      tradename: ['', Validators.required],
      tradedetail: ['', Validators.required],
      tradeimage: ['', Validators.required]

    })
  }
  getalltrade() {
    let url = API.CRM_ENDPOINTS.GET_ALL_TRADE_ASSURANCE;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result) => {
        console.log(result)
        if (result.success) {
          this.tradeassurancelist = result.data;
        }
        else {
          this.toasterService.Error(result.error);
        }

      }
    })
  }
  onfileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];

      //this.addtrade.get('tradeimage').setValue(file);
    }

  }
  onsubmit() {
    
    let formDatas = new FormData();
    formDatas.append('name', this.addtrade.get('tradename').value);
    formDatas.append('details', this.addtrade.get('tradedetail').value);
    formDatas.append('trade_assurance_image', this.file);
    console.log(formDatas)
    if (this.addtrade.valid) {

      let url = API.CRM_ENDPOINTS.ADD_TRADE_ASSURANCE;
      console.log(url)
      this.apiHandlerService.apiPost(url, formDatas, {}, { contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.toasterService.Success(data.message);
            this.modalService.dismissAll();
            this.clearInputMethod()
            this.getalltrade();
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

          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        }

      })
    }

  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openedit(content: any, prodid: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log("this.closeResult", this.closeResult)
    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.productid = prodid;
    let url = API.CRM_ENDPOINTS.GET_ALL_TRADE_ASSURANCE + '/' + prodid;
    this.apiHandlerService.apiGet(url).subscribe({
      next: (result) => { // 
        if (result.success) {
          // this.tradeassurancelist=result.data;
          this.addtrade.get('tradename').setValue(result.data.name);
          this.addtrade.get('tradedetail').setValue(result.data.details);
          this.imgeurl = result.data.trade_assurance_image;
          this.addtrade.get('tradeimage').setValue(result.data.trade_assurance_image);
        }
        else {
          this.toasterService.Error(result.error);
        }
        console.log(result)


      }
    })


  }

  private getDismissReason(reason: any): string {
    console.log(reason)
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onupdatesubmit() {

    let formDatas = new FormData();
    formDatas.append('name', this.addtrade.get('tradename').value);
    formDatas.append('details', this.addtrade.get('tradedetail').value);
    if (this.file) {
      formDatas.append('trade_assurance_image', this.file);
    } else {
      formDatas.append('trade_assurance_image', this.addtrade.get('tradeimage').value)
      //console.log("gee",this.addtrade.get('tradeimage').value)
    }

    console.log(this.addtrade.valid)
    if (this.addtrade.valid) {

      let url = API.CRM_ENDPOINTS.UPDATE_TRADE_ASSURANCE + '/' + this.productid;
      console.log(url)
      this.apiHandlerService.apiPost(url, formDatas, {}, { contentType: { isFormDataContent: true } }).subscribe({
        next: (data) => {
          if (data.success) {
            this.toasterService.Success(data.message);
            this.modalService.dismissAll();
            this.clearInputMethod()
            this.getalltrade();
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

          if (typeof err == 'string') {
            this.toasterService.Error(err);
          } else if (err.error && err.error.message) {
            this.toasterService.Error(err.error.message);
          }
        }

      })
    }
  }
  clearInputMethod() {
    //this.addnewsku.controls.sku_code.reset(); 
    this.addtrade.controls.tradename.reset();
    this.addtrade.controls.tradedetail.reset();
    this.addtrade.controls.tradeimage.reset();

  }
}
