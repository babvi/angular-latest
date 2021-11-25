import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Faq } from './../model/faq';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor( private http: HttpClient ) { }


	getAllFaqList() {
		return this.http.get<any>(CONFIG.getAllFaqListURL)
		.pipe(map(data => {
        return data;
    	}));
	}

  getFaqTopicList() {
		return this.http.get<any>(CONFIG.getFaqTopicListURL)
		.pipe(map(data => {
        return data;
    	}));
	}

  getFaqById(id: number) {
    return this.http.get<any>(CONFIG.getFaqByIdURL + id)
    .pipe(map(data => {
        return data;
      }));
  }

  updateFaq(faqData: any, id: number){
  	return this.http.put<any>(CONFIG.updateFaqURL + id, faqData)
    .pipe(map(response => {
        return response;
    }));
  }

  createFaq(faqData: Faq){
  	return this.http.post<any>(CONFIG.createFaqURL, faqData)
    .pipe(map(response => {
        return response;
    }));

  }

  changeFaqStatus(status: string, id: number){
    return this.http.put<any>(CONFIG.changeFaqStatusURL, {id: id, status: status})
    .pipe(map(response => {
        return response;
    }));
  }

  deleteFaq(id: number){
    return this.http.delete<any>(CONFIG.deleteFaqURL + id)
    .pipe(map(response => {
        return response;
    }));
  }

}
