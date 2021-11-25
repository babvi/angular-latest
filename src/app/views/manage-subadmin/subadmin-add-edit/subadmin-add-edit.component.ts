import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SubadminService } from './../../../_services/subadmin-service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Subadmin } from './../../../model/subadmin';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-subadmin-add-edit',
  templateUrl: './subadmin-add-edit.component.html',
  styleUrls: ['./subadmin-add-edit.component.scss']
})
export class SubadminAddEditComponent implements OnInit {

  @ViewChild('f') form: any;

  private _id: number;
  editMode: boolean = false;
  editSubadminId: number;
  submitted: boolean = false;
  subadmin_subject: string;
  subadmin_body: string;
  roleList: any;
  routeSub: Subscription;
  subadminSub: Subscription;
  activeRoleList: Subscription;
  subadminTopicList: Subscription;
  subadminSaveSub: Subscription;
  model: any = [];
  role = '';

  constructor(private route: ActivatedRoute,
    private subadminService: SubadminService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.activeRoleList = this.subadminService.getActiveRoleList()
      .pipe(first())
      .subscribe(
        response => {
          this.roleList = response.data;
        },
        error => {
          console.log(error);
        });

    this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this.editMode = params['id'] != null;
        setTimeout(() => {
          this.initForm();
        }, 100);
      });
  }

  initForm() {
    if (this.editMode) {
      this.subadminSub = this.subadminService.getSubadminById(this._id)
        .pipe(first())
        .subscribe(
          response => {
            this.editSubadminId = response.data.id || null;
            this.model.first_name = response.data.first_name || '';
            this.model.last_name = response.data.last_name || '';
            this.model.username = response.data.username || '';
            this.model.email = response.data.email || '';
            this.role = response.data.roles[0].id || '';
          },
          error => {
            console.log(error);
          });
    }
  }

  onSubadminSave(frm: NgForm) {

    this.submitted = true;
    // stop here if form is invalid
    if (frm.invalid) {
      return;
    }
    delete frm.value['confirm_pass'];
    if (this.editSubadminId) {
      this.updateSubadmin(frm.value, this.editSubadminId);
    } else {
      this.createSubadmin(frm.value);
    }
  }

  createSubadmin(formData) {
    this.subadminSaveSub = this.subadminService.createSubadmin(formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/subadmin/list']);
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
            this.router.navigate(['/subadmin/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  updateSubadmin(formData, id) {
    this.subadminSaveSub = this.subadminService.updateSubadmin(formData, id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.router.navigate(['/subadmin/list']);
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
            this.router.navigate(['/subadmin/list']);
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.activeRoleList.unsubscribe();
    if (this.editMode) {
      this.subadminSub.unsubscribe();
    }
  }

}
