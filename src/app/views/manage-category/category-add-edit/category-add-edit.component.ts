import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from './../../../_services/category-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-add-edit',
  templateUrl: './category-add-edit.component.html',
  styleUrls: ['./category-add-edit.component.scss']
})
export class CategoryAddEditComponent implements OnInit {

  @ViewChild('f') form: any;

  private _id: number;
  editMode: boolean = false;
  editCategoryId: number;
  submitted: boolean = false;
  category_subject: string;
  category_body: string;
  topicListData: any;
  routeSub: Subscription;
  categorySub: Subscription;
  categorySaveSub: Subscription;
  category_status = 'Active';
  category_name: string;
  isOpen = false;
  category_description: string;
  addEditCmsForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this.editMode = params['id'] != null;
        setTimeout(() => {
          this.initForm();
        }, 100);
      });
  }

  openTree() {
    this.isOpen = (this.isOpen == true ? false : true);
  }

  initForm() {
    if (this.editMode) {
      this.categorySub = this.categoryService.getCategoryById(this._id)
        .pipe(first())
        .subscribe(
          response => {
            this.editCategoryId = response.data.id || null;
            this.category_name = response.data.name || '';
            this.category_description = response.data.description || '';
            this.category_status = response.data.status || 'Active';
          },
          error => {
            console.log(error);
          });
    }

  }

  onCategorySave() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    if (this.editCategoryId) {
      this.updateCategory(this.form.value, this.editCategoryId);
    } else {
      this.createCategory(this.form.value);
    }
  }

  createCategory(formData) {
    this.categorySaveSub = this.categoryService.createCategory(formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/category/list']);
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
            this.router.navigate(['/category/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  updateCategory(formData, id) {
    this.categorySaveSub = this.categoryService.updateCategory(formData, id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/category/list']);
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
            this.router.navigate(['/category/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    if (this.editMode) {
      this.categorySub.unsubscribe();
    }
  }

}
