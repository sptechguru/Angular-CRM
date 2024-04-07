import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
import { catchError, map, tap } from 'rxjs/operators';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { StorageAccessorService } from 'app/shared/services/localstorage-accessor.service';
import { environment } from 'environments/environment';
// import {Http, Headers} from '@angular/http';
let headers = new Headers();
headers.append('Access-Control-Allow-Origin', '*')
interface ErroeObject {
  caller?: string;
  errorTitle?: string;
  errorMessage?: string;
}

interface Extras {
  contentType: {
    isFormDataContent?: boolean;
    isJsonContent?: boolean;
  };
}

interface HttpResponseData {
  data?: any;
  message?: any;
  error?: any;
  success?: any;
}

@Injectable()
export class ApiHandlerService {

  readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient, private localStorage: StorageAccessorService,
     ) { }

  apiGet(url, params?, extras?: Extras) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    return this.http.get<any>(url, options).timeout(20000);
  }

  apiPost(url, reqBody, params?, extras?: Extras) {
    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*')
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
  //  options=this.appendParams(options,headers);
    console.log(options)
    reqBody = reqBody ? reqBody : {};
    return this.http.post<HttpResponseData>(url, reqBody, options).timeout(20000);
  }

  apiUpdate(url, reqBody, params?, extras?: Extras) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    return this.http.put(url, reqBody, options).timeout(20000);
  }

  apiDelete(url, params?, extras?) {
    let options = this.renderHeaders(extras);
    options = this.appendParams(options, params);
    return this.http.delete(url);
  }

  private renderHeaders(extras: Extras) {
    // if extras is present then apply check
    if (extras) {
      if (extras.contentType.isFormDataContent) {
        return {};
      }
    } else {
      // else assume it to be json data
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'Expires': '-1',
          'Pragma': 'no-cache'
        })
      };
    }
  }

  private appendParams(originalOptions, paramsObj) {
    let params = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        params = params.append(key, paramsObj[key]);
      }
    }
    return Object.assign({}, originalOptions, { params: params });
  }

  
  countryList() {
    return this.http.get(this.baseUrl + `/api/crm/get-countries?offset=0&limit=100`);
  }
  stateList(id) {
    return this.http.get(this.baseUrl + `/api/crm/get-states?offset=0&limit=500`+id);
  }

  cityList(id) {
    return this.http.get(this.baseUrl + `/api/crm/get-cities?offset=0&limit=100&state_id=` + id);
  }

  getUserList(status) {
    return this.http.get(this.baseUrl + `/api/crm/get-reseller-user-list?limit=10&offset=0&status=${status}`);
  }

  getSearchList(id) {
    // return this.http.get(this.baseUrl + `/api/crm/get-reseller-user-list?limit=10&offset=0&status=${search}`);
    return this.http.get(this.baseUrl+ `/api/crm/resellers/${id}?search_text=&limit=10&offset=0`)
  }


  getAddress(id) {
    // return this.http.get(this.baseUrl + `/api/crm/get-reseller-user-list?limit=10&offset=0&status=${search}`);
    return this.http.get(this.baseUrl+ `/api/crm/get-user-addresses/${id}`)
  }


}
