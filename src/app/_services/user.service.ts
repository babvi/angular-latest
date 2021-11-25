import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient ) { }

  	getUserProfile() {
   		return this.http.get<any>(CONFIG.getUserProfileIdURL)
   		.pipe(map(data => {
            // login successful if there's a jwt token in the response
            
            return data;
        }));
	}
}
