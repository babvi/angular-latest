import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Hcc } from './../model/hcc';

@Injectable({
  providedIn: 'root'
})
export class HCCService {

  constructor( private http: HttpClient ) { }


	getAllHCCList() {
		return this.http.get<any>(CONFIG.getAllHCCListURL)
		.pipe(map(data => {
        // login successful if there's a jwt token in the response
        
        return data;
    	}));
	}

  getHCCById(id: number) {
    return this.http.get<any>(CONFIG.getHCCByIdURL + id)
    .pipe(map(data => {
        // login successful if there's a jwt token in the response
        
        return data;
      }));
  }

  createHCC(hccData: Hcc){
    return this.http.post<any>(CONFIG.createHCCURL, hccData)
    .pipe(map(response => {
        return response;
    }));

  }

  updateHCC(hccData: Hcc, id: number){
  	return this.http.put<any>(CONFIG.updateHCCURL + id, hccData)
    .pipe(map(response => {
        return response;
    }));

  }

  deleteHCC(id: string){
    return this.http.delete<any>(CONFIG.deleteHCCURL + "/" + id, {})
    .pipe(map(response => {
        return response;
    }));
  }
}
