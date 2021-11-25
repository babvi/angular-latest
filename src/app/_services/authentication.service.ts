import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../config/app-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
	private loggedInStatus = false;

  	constructor(private http: HttpClient) { }

  	setLoggedIn(value: boolean) {
		this.loggedInStatus = value;  		
  	}

  	get isLoggedIn() {
  		return this.loggedInStatus;
  	}

  	login(email: string, password: string) {
    	return this.http.post<any>(CONFIG.userAuthURL, { email: email, password: password, role: 'ADMIN'})
        .pipe(map(user => {
            // login successful if there's a jwt token in the response
            if (user.data && user.meta && user.meta.status === true) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            return user;
        }));
    }

    forgotPassword(email: string) {
      return this.http.post<any>(CONFIG.forgotPassURL, { email: email, role: 'ADMIN'})
        .pipe(map(response => {
            return response;
        }));
    }

  	logout() {
      	// remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        //Remove the all listing intance which used for resume last data
        localStorage.removeItem(CONFIGCONSTANTS.adminListing);
        localStorage.removeItem(CONFIGCONSTANTS.DataTablesCmsTable);
        localStorage.removeItem(CONFIGCONSTANTS.DataTablesExample);
        localStorage.removeItem(CONFIGCONSTANTS.DataTablesSkillTable);
        localStorage.removeItem(CONFIGCONSTANTS.subscriptionPermissionList);
  	}

    validateResetPass(token){
      return this.http.post<any>(CONFIG.validateResetPassURL, { token: token})
      .pipe(map(response => {
          return response;
      }));
    }

    resetPass(token:string, password:string, cPassword:string){
      return this.http.put<any>(CONFIG.resetPassURL, { new_password: password, confirm_password: cPassword, token: token})
      .pipe(map(response => {
          return response;
      })); 
    }


    getPermissions(){
      let currentUserPermissions = [];
      let currentUser = localStorage.getItem('currentUser');
      if(currentUser){
        let currentUserJson = JSON.parse(currentUser);
        currentUserPermissions = currentUserJson.data.user_detail.permission || [];
      }
      return currentUserPermissions;
    }
}
