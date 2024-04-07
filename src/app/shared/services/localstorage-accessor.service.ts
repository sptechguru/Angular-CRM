import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";
import { environment } from "environments/environment";
import { isDevMode } from "@angular/core";
import { Router } from "@angular/router";

const dataName = "userData";

export interface UserData {
  data:object,
  _id: string,
  email: string,
  gender: string,
  first_name: string,
  last_name: string
  image?: string,
  user_type: string,
  status: string,
  otp_verify: string,
  access_token: string,
  loginForm: {
    email?: string;
    password?: string;
  };
}

@Injectable()
export class StorageAccessorService {
  encryptionKey = environment.encryptionKey;
  constructor(private router: Router) { }

  storeData(data: UserData | object) {
    if (data) {
      if (isDevMode()) {
        localStorage.setItem(dataName, JSON.stringify(data));
      } else {
        localStorage.setItem(
          dataName,
          CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey)
        );
      }
    }
  }

  fetchData(): UserData | null {
    const userData = localStorage.getItem(dataName);
    if (!userData) {
      return null;
    }
    try {
      if (isDevMode()) {
       
        
        return JSON.parse(userData);
      }
      const bytes = CryptoJS.AES.decrypt(userData.toString(), this.encryptionKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // // console.log(decryptedData.loginForm);
      return decryptedData;
    } catch (err) {
      this.deleteData();
      this.router.navigate(["/login"]);
    }
  }

  fetchToken() {
    const userData = this.fetchData();
    if (userData) {
      return userData.access_token || "";
    } else {
      return "";
    }
  }

  storeToken(newToken) {
    const userData = this.fetchData();
    if (userData) {
      const newData = Object.assign({}, userData, { access_token: newToken });
      this.storeData(newData);
    }
  }

  get crmUserPermissions(){
    return this.fetchUserDetailsByKey('fk_user_role_id') === 2 || this.fetchUserDetailsByKey('fk_user_role_id') === 4;
  }

  get fetchRole() : 'admin' | [string] |null {
    if(!this.fetchData)return
    const userData = this.fetchUserDetailsByKey('user_role').role_name;
    return 'admin';
    if(userData === 'crm-admin'){}
    const data :[any] = this.fetchUserDetailsByKey('permission_managements') as [any]
    
    let permmison = data.map(elements=>{
     return elements.menu_management.menu_name as string
   })
  //  // console.log(permmison);
   
   return permmison as [string];
  }

  fetchUserDetailsByKey(keyToFetch) {
    const userData = this.fetchData();
    if (userData) {
      return userData.data[keyToFetch] || "";
    } else {
      return "";
    }
  }


 set setPage(obj){
    // Put the object into storage
   localStorage.setItem('pageIndex', JSON.stringify({...this.getPage,...obj}));
;

  }

  get getPage(){
    return JSON.parse(localStorage.getItem('pageIndex'))
  }

  deleteToken() {
    this.storeToken("");
  }

  deleteData() {
    localStorage.removeItem(dataName);
  }
}
