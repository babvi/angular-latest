import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor( private http: HttpClient ) { }

  deleteManageJob(id: string) {
   		return this.http.post<any>(CONFIG.deleteManageJobURL, {job_uuid: id, action: '4'})
   		.pipe(map(data => {
            return data;
        }));
  }
  
  getJobViewDetailById(id: string) {
    return this.http.get<any>(CONFIG.getJobViewDetailByIdURL + id)
   		.pipe(map(data => {
            return data;
        }));
  }

  approveJob(uuid: string, note: string) {
    return this.http.post<any>(CONFIG.approveJobURL + uuid, {is_approve: '2', note: note})
   		.pipe(map(data => {
            return data;
        }));
  }

  rejectJob(uuid: string, note: string) {
    return this.http.post<any>(CONFIG.rejectJobURL + uuid, {is_approve: '6', note: note})
   		.pipe(map(data => {
            return data;
        }));
  }

  getEmploymentStatus() {
    return this.http.get<any>(CONFIG.getEmploymentStatusURL)
    .pipe(map(data => {
        return data;
    }));
  }

  getProductionType() {
    return this.http.get<any>(CONFIG.getProductionTypeList)
    .pipe(map(data => {
        return data;
    }));
  }
}
