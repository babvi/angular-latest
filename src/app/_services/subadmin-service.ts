import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Subadmin } from './../model/subadmin';

@Injectable({
  providedIn: 'root'
})
export class SubadminService {

  constructor( private http: HttpClient ) { }

  getAllSubadminList(SubadminData: any){
  	return this.http.post<any>(CONFIG.getAllSubadminListURL, SubadminData)
    .pipe(map(response => {
        return response;
    }));
  }

  getSubadminById(id: number) {
    return this.http.get<any>(CONFIG.getSubadminByIdURL + id)
    .pipe(map(data => {
        return data;
      }));
  }

  getActiveRoleList(){
    return this.http.get<any>(CONFIG.getActiveRoleURL)
    .pipe(map(data => {
        return data;
      }));
  }

  updateSubadmin(SubadminData: any, id: number){
  	return this.http.put<any>(CONFIG.updateSubadminURL + id, SubadminData)
    .pipe(map(response => {
        return response;
    }));
  }

  createSubadmin(SubadminData: Subadmin){
  	return this.http.post<any>(CONFIG.createSubadminURL, SubadminData)
    .pipe(map(response => {
        return response;
    }));
  }

  changeSubadminPassword (SubadminData: any){
    return this.http.put<any>(CONFIG.changeSubadminPassURL, SubadminData)
    .pipe(map(response => {
        return response;
    }));
  }

  changeSubadminStatus(status: string, id: number){
    return this.http.put<any>(CONFIG.changeSubadminStatusURL, {id: id, status: status})
    .pipe(map(response => {
        return response;
    }));
  }


  deleteSubadmin(id: number){
    return this.http.delete<any>(CONFIG.deleteSubadminURL + id)
    .pipe(map(response => {
        return response;
    }));
  }

}
