import { NgModule } from "@angular/core";
import { ModuleWithProviders } from "@angular/compiler/src/core";
import { from } from "rxjs/observable/from";
import { ApiHandlerService } from "./services/api-handler.service";
import { StorageAccessorService } from "./services/localstorage-accessor.service";
import { ToasterService } from "./services/toaster.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./services/app.interceptor";
import { AuthGuardService, CrmUserGuardService, PermissionGuardService } from "./services/auth.guard.service";
import { ConfirmationDialogHandlerService } from "./components/confirmation-dialog/confirmation-dialog-handler.service";
import { CustomeValidationService } from "./services/custom-validation.service";
@NgModule({})
export class SharedProvidersModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedProvidersModule,
      providers: [
        CustomeValidationService,
        AuthGuardService,
        ApiHandlerService,
        PermissionGuardService,
        CrmUserGuardService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },
        StorageAccessorService,
        ToasterService
      ]
    };
  }
}
