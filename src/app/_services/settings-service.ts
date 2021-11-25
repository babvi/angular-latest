import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';
import { Settings } from './../model/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http: HttpClient ) { }

  /* Get Response of the Settings Data */
  getSettingsDataURL() {
    /* added {} as empty parameter due POST method but need to remove {} and replace POST Method to GET Method */
  	return this.http.post<any>(CONFIG.getSettingsDataURL, {})    .pipe(map(response => {
        return response;
    }));
  }

  /* SAVE Data to the Settings Data */
  updateSettingsDataURL(SettingsData: any){
  	return this.http.post<any>(CONFIG.getSettingsSaveDataURL, SettingsData)
    .pipe(map(response => {
        return response;
    }));
  }

  /* Get Image URL */
  getSettingsImageDataURL() {
  	return this.http.get<any>(CONFIG.getSettingsImageDataURL)
    .pipe(map(response => {
        return response;
    }));
  }

  /* Delete Image on basis of ID value */
  removeImage(id: number){
    return this.http.get<any>(CONFIG.getSettingsRemoveImageURL + id)
    .pipe(map(response => {
        return response;
    }));
  }
}
