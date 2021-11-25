import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Cms } from './../model/cms';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  constructor( private http: HttpClient ) { }


	getAllCmsList() {
		return this.http.get<any>(CONFIG.getAllCmsListURL)
		.pipe(map(data => {
        // login successful if there's a jwt token in the response
        
        return data;
    	}));
	}

  getCmsById(id: number) {
    return this.http.get<any>(CONFIG.getCmsByIdURL + id)
    .pipe(map(data => {
        // login successful if there's a jwt token in the response
        
        return data;
      }));
  }

  createCms(cmsData: Cms){
  	return this.http.post<any>(CONFIG.createCmsURL, cmsData)
    .pipe(map(response => {
        return response;
    }));

  }


  updateCms(cmsData: Cms, id: number){
  	return this.http.put<any>(CONFIG.updateCmsURL + id, cmsData)
    .pipe(map(response => {
        return response;
    }));

  }

  changeCmsStatus(status: string, id: number){
    return this.http.put<any>(CONFIG.changeCmsStatusURL, {id: id, status: status})
    .pipe(map(response => {
        return response;
    }));
  }
}
