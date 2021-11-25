import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Manageuser } from './../model/manageuser';

@Injectable({
  providedIn: 'root'
})
export class ManageuserService {

  constructor( private http: HttpClient ) { }

  getAllManageUserListURL(ManageuserData: any) {
  	return this.http.post<any>(CONFIG.getAllManageUserListURL, ManageuserData)
    .pipe(map(response => {
        return response;
    }));
  }

  getManagerUserById(id: number) {
    return this.http.get<any>(CONFIG.getManagerUserByIdURL + id)
    .pipe(map(data => {
        return data;
      }));
  }

  updateManageUser(ManageuserData: any, id: number){
  	return this.http.post<any>(CONFIG.updateManageUserURL + id, ManageuserData)
    .pipe(map(response => {
        return response;
    }));
  }

  createManageUser(ManageuserData: Manageuser){
  	return this.http.post<any>(CONFIG.createManageUserURL, ManageuserData)
    .pipe(map(response => {
        return response;
    }));
  }

  changeManageUserPassword(ManageuserData: any){
    return this.http.put<any>(CONFIG.changeManageUserPassURL, ManageuserData)
    .pipe(map(response => {
        return response;
    }));
  }

  changeManageUserStatus(status: string, id: number){
    return this.http.put<any>(CONFIG.changeManageUserStatusURL, {id: id, status: status})
    .pipe(map(response => {
        return response;
    }));
  }

  deleteManageUser(id: number){
    return this.http.delete<any>(CONFIG.deleteManageUserURL + id)
    .pipe(map(response => {
        return response;
    }));
  }

  deleteUserProfile(id: any){
    return this.http.get<any>(CONFIG.deleteUserProfileURL + id)
    .pipe(map(response => {
        return response;
    }));
  }

}
