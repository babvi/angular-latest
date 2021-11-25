import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Hcq } from './../model/hcq';

@Injectable({
  providedIn: 'root'
})
export class HCQService {

  constructor( private http: HttpClient ) { }


	getAllHCQList() {
		return this.http.get<any>(CONFIG.getAllHCQListURL)
		.pipe(map(data => {
        // login successful if there's a jwt token in the response
        
        return data;
    	}));
	}

  getHCQById(id: number) {
    return this.http.get<any>(CONFIG.getHCQByIdURL + id)
    .pipe(map(data => {
        // login successful if there's a jwt token in the response
        
        return data;
      }));
  }

  createHCQ(hccData: Hcq){
    return this.http.post<any>(CONFIG.createHCQURL, hccData)
    .pipe(map(response => {
        return response;
    }));

  }

  updateHCQ(hccData: Hcq, id: number){
  	return this.http.put<any>(CONFIG.updateHCQURL + id, hccData)
    .pipe(map(response => {
        return response;
    }));

  }

  deleteHCQ(id: string){
    return this.http.delete<any>(CONFIG.deleteHCQURL + "/" + id, {})
    .pipe(map(response => {
        return response;
    }));
  }
}
