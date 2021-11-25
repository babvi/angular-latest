import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Email } from './../model/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor( private http: HttpClient ) { }


	getAllEmailList() {
		return this.http.get<any>(CONFIG.getAllEmailListURL)
		.pipe(map(data => {
        return data;
    	}));
	}

  getEmailById(id: number) {
    return this.http.get<any>(CONFIG.getEmailByIdURL + id)
    .pipe(map(data => {
        return data;
      }));
  }

  updateEmail(emailData: any, id: number){
  	return this.http.put<any>(CONFIG.updateEmailURL + id, emailData)
    .pipe(map(response => {
        return response;
    }));

  }

}
