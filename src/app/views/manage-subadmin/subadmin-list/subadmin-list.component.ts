import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SubadminService } from './../../../_services/subadmin-service';
import { Subadmin } from './../../../model/subadmin';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../../config/app-config';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-subadmin-list',
  templateUrl: './subadmin-list.component.html',
  styleUrls: ['./subadmin-list.component.scss']
})
export class SubadminListComponent implements OnDestroy, OnInit {

  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  activeRoleList: Subscription;
  subadminList: Subadmin[] = [];
  submitted = false;
  newpass: string;
  status = '';
  role = '';
  fullname = '';
  email = '';
  confirmpass: string;
  subadmnID: number;
  changeStatusType: string;
  changedStatus: string;
  roleList: any;
  permissions: any[];

  constructor(private subadminService: SubadminService, private toastr: ToastrService,
    private modalService: BsModalService, private permissionsService: NgxPermissionsService) { }

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
    this.getAllSubadminList();
  }

  getAllSubadminList() {

    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('SUB_ADMIN_UPDATE') == -1 && permsn.indexOf('SUB_ADMIN_DELETE') == -1 && permsn.indexOf('SUB_ADMIN_CHANGE_PASSWORD') == -1 && permsn.indexOf('SUB_ADMIN_STATUS') == -1 && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: 'srNum' }, { data: 'fullname' }, { data: 'email' }, { data: 'roles', orderable: false }, { data: 'created_at' }, { data: 'updated_at' }, { data: 'status' }];
    } else {
      columnsArry = [{ data: 'srNum' }, { data: 'fullname' }, { data: 'email' }, { data: 'roles', orderable: false }, { data: 'created_at' }, { data: 'updated_at' }, { data: 'status' }, { data: '', orderable: false }];
    }
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      searching: false,
      autoWidth: false,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.subadminService.getAllSubadminList(Object.assign(dataTablesParameters, {
          name: this.fullname,
          email: this.email,
          status: this.status,
          role: this.role
        }))
          .pipe(first())
          .subscribe(resp => {
            that.subadminList = resp.data['original'].data;
            callback({
              recordsTotal: resp.data['original'].recordsTotal,
              recordsFiltered: resp.data['original'].recordsFiltered,
              data: []
            });
          });
      },
      columns: columnsArry
    };

  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.subadmnID = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
    this.newpass = '';
    this.confirmpass = '';
    this.submitted = false;
  }

  changeStatus() {
    this.changedStatus = this.changeStatusType == 'Active' ? 'Inactive' : 'Active';
    this.subadminService.changeSubadminStatus(this.changedStatus, this.subadmnID)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender();
          }
        },
        error => {
          let statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
        });
  }

  deleteSubadmin() {
    this.subadminService.deleteSubadmin(this.subadmnID)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender();
          }
        },
        error => {
          let statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
        });
  }

  searchApply() {
    this.rerender();
  }

  resetSearch() {
    this.fullname = '';
    this.email = '';
    this.status = '';
    this.role = '';
    this.rerender();
  }

  changePassword(changePassFrm: NgForm) {

    this.submitted = true;
    if (changePassFrm.invalid) {
      return;
    }

    let data = {
      user_id: this.subadmnID,
      new_password: this.newpass,
      confirm_password: this.confirmpass
    }

    this.subadminService.changeSubadminPassword(data)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.newpass = '';
            this.confirmpass = '';
            this.submitted = false;
            this.rerender();
          }
        },
        error => {
          this.newpass = '';
          this.confirmpass = '';
          this.submitted = false;
          let statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
        });
  }

  ngOnDestroy(): void {
    this.activeRoleList.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

}
