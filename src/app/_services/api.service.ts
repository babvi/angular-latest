import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../config/app-constants';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private http: HttpClient) { }

    postRequest(URL: string, Params: any) {
        return this.http.post<any>(URL, Params)
            .pipe(map(response => {
                return response;
            }));
    }

    getRequest(URL: string) {
        return this.http.get<any>(URL)
            .pipe(map(response => {
                return response;
            }));
    }
     putRequest(URL: string, Params: any) {
        return this.http.put<any>(URL, Params)
            .pipe(map(response => {
                return response;
            }));
    }

    deleteRequest(URL: string, Params: any) {
        return this.http.delete<any>(URL, { params: Params})
            .pipe(map(response => {
                return response;
            }));
    }

    setListingResume (name, reqData) {
        var getData = localStorage.getItem(CONFIGCONSTANTS.adminListing);
        if (getData) {
            var parsedData = JSON.parse(getData);
            parsedData[CONFIGCONSTANTS.adminListing][name] = reqData;
            localStorage.setItem(CONFIGCONSTANTS.adminListing, JSON.stringify(parsedData));
        } else {
            var obj = {};
            obj[name] = reqData;
            var data = {
                'admin-listing': obj
            };
            localStorage.setItem(CONFIGCONSTANTS.adminListing, JSON.stringify(data));
        }
    }

    getListingResume (name) {
        var getData = localStorage.getItem(CONFIGCONSTANTS.adminListing);
        if (getData) {
            var returnData = JSON.parse(getData);
            if (returnData[CONFIGCONSTANTS.adminListing][name]) {
                return returnData[CONFIGCONSTANTS.adminListing][name];
            }
            return null;
        }
        return null;
    }
}
