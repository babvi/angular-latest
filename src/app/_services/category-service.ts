import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CONFIG } from '../config/app-config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }


  getAllCategoryList() {
    return this.http.get<any>(CONFIG.getAllCategoryListURL)
      .pipe(map(data => {
        return data;
      }));
  }
  getCategoryTreeview() {
    return this.http.get<any>(CONFIG.getCategoryTreeviewURL)
      .pipe(map(data => {
        return data;
      }));
  }

  getCategoryById(id: number) {
    return this.http.get<any>(CONFIG.getCategoryByIdURL + id)
      .pipe(map(data => {
        return data;
      }));
  }

  updateCategory(categoryData: any, id: number) {
    return this.http.put<any>(CONFIG.updateCategoryURL + id, categoryData)
      .pipe(map(response => {
        return response;
      }));
  }

  createCategory(categoryData: any) {
    return this.http.post<any>(CONFIG.createCategoryURL, categoryData)
      .pipe(map(response => {
        return response;
      }));

  }

  changeCategoryStatus(status: string, id: number) {
    return this.http.put<any>(CONFIG.changeCategoryStatusURL, { id: id, status: status })
      .pipe(map(response => {
        return response;
      }));
  }

  deleteCategory(id: number) {
    return this.http.delete<any>(CONFIG.deleteCategoryURL + id)
      .pipe(map(response => {
        return response;
      }));
  }

  saveCategoryTreeviewData(categoryData: any) {
    return this.http.post<any>(CONFIG.createCategoryTreeURL, categoryData)
      .pipe(map(response => {
        return response;
      }));
  }

}
