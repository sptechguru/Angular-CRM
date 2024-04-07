import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { TimeoutError } from 'rxjs/util/TimeoutError';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { ERROR_MSG } from 'app/shared/constants/consts';
import { ToasterService } from 'app/shared/services/toaster.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private localStorage: StorageAccessorService,
    private toaster: ToasterService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | Observable<any> {

    const token = this.localStorage.fetchToken();

    const newReq = request.clone({
      setHeaders: {
        'access_token': token,
      }
    });

    return next.handle(newReq)
      .catch(err => {
        let errorMsg;
        // console.log('err : ', err);
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.toaster.Error(ERROR_MSG.UNAUTHORIZED_ACCESS, 'Unauthoried Access');
          this.localStorage.deleteToken();
          this.localStorage.deleteData();
          this.router.navigate(['/auth/login']);
          return Observable.empty();
        }

        // // console.log('err instanceof HttpErrorResponse : ', err instanceof HttpErrorResponse);
        // // console.log('(err.status == 422) : ', (err.status == 422));
        // // console.log('err : ', err.error.error[0].msg);
        if (err instanceof HttpErrorResponse && (err.status == 422)) {
          if (err.error && err.error.error[0] && err.error.error[0].msg) {
            err = {
              error: {
                message: err.error.error[0].msg
              }
            };
          } else {
            err = {
              error: {
                message: 'Something went wrong unable to process.'
              }
            };
          }
        }
        return Observable.throw(err);
      });
  }

}
