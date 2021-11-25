import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from './../../../_services/category-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { OnDestroy, TemplateRef } from '@angular/core';
import { Role } from './../../../model/role';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-category-treeview',
  templateUrl: './category-treeview.component.html',
  styleUrls: ['./category-treeview.component.scss']
})
export class CategoryTreeviewComponent implements OnInit {

  roleLoading: boolean = false;
  submitted: boolean = false;
  allCategory: any[];
  newArray: any = [];
  finalArray: any[];
  options = {
    allowDrag: true,
    allowDrop: true
  };
  isPermissionSub: boolean = false;

  constructor(private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCategoryTreeData();

  }

  getCategoryTreeData() {
    this.categoryService.getCategoryTreeview().subscribe(data => {
      this.allCategory = data.data;
    });
  }

  onMoveNode(event) {
    console.log(event);
  }

  myFun(categoryDt, parentId) {
    let that = this;
    categoryDt.forEach(function(value, key) {
      that.newArray.push({ 'id': value.id, 'parent_id': parentId });
      if (value.children.length > 0) {
        that.myFun(value.children, value.id);
      }
    });
    console.log(that.newArray);
  }

  saveCategoryData() {
    this.myFun(this.allCategory, 0);
    let bodyData = {
      catData: this.newArray
    }
    this.categoryService.saveCategoryTreeviewData(bodyData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/category/treeview']);
          }
        },
        error => {
          var errorData = error;
          if (errorData && errorData.meta) {
            if (errorData.meta.message_code == 'VALIDATION_ERROR') {
              if (errorData.errors.page_title) {
                this.toastr.error(errorData.errors.page_title[0]);
              }
            } else {
              this.toastr.error(errorData.meta.message);
            }
          } else {
            this.router.navigate(['/category/treeview']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

}
