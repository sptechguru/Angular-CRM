import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ToasterService {
  toastConfig = {
    timeOut: 5000,
    closeButton: true,
    enableHtml: true,
    progressBar: true
  };

  constructor(private toastrService: ToastrService) { }

  Success(message = "", title?: string) {
    this.toastrService.success(message, title, this.toastConfig);
  }

  Error(message = "", title?: string) {
    this.toastrService.error(message, title, this.toastConfig);
  }

  ErrorTimeOut(errMessag: string) {
    this.toastrService.error(
      errMessag ? errMessag : "Connection timeout, Please try again later.",
      "",
      this.toastConfig
    );
  }
}
