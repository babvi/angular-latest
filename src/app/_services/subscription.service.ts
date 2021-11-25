import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor( private http: HttpClient ) { }
  
  changeStatus(data: any) {
    return this.http.post<any>(CONFIG.changeSubStatusURL, data)
    .pipe(map(data => {
        return data;
    }));
  }

  updateSubscription(data: any) {
    return this.http.post<any>(CONFIG.updateSubscriptionURL, data)
    .pipe(map(data => {
        return data;
    }));
  }

  getSubscriptionList() {
    return this.http.post<any>(CONFIG.getSubscriptionListURL, {type: 'admin'})
    .pipe(map(data => {
        return data;
    }));
  }

  editSubPermissionById(data: any) {
    return this.http.post<any>(CONFIG.editSubPermissionById, data)
    .pipe(map(data => {
        return data;
    }));
  }
}
