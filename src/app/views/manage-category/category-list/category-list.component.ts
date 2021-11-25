import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CategoryService } from './../../../_services/category-service';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnDestroy, OnInit {

  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  categoryList: any[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  changeStatusId: number;
  deleteCategoryId: number;
  changeStatusType: string;
  changedStatus: string;


  constructor(private categoryService: CategoryService, private toastr: ToastrService,
    private modalService: BsModalService, private permissionsService: NgxPermissionsService) { }

  ngOnInit() {

    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('CATEGORY_UPDATE') == -1 && permsn.indexOf('CATEGORY_DELETE') == -1 && permsn.indexOf('CATEGORY_STATUS') == -1 && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: '', searchable: false }, { data: 'name' }, { data: 'parent_name' }, { data: 'status' }]
    } else {
      columnsArry = [{ data: '', searchable: false }, { data: 'name' }, { data: 'parent_name' }, { data: 'status' },{ orderable: false, searchable: false }]
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        'searchPlaceholder': 'Search...',
      },
      stateSave: false,
      pageLength: 10,
      processing: true,
      columns: columnsArry
    };
    this.getAllCategoryList();

  }

  getAllCategoryList(): void {
    this.categoryService.getAllCategoryList()
      .pipe(first())
      .subscribe(
        data => {
          this.categoryList = data.data;
          //Calling the DT trigger to manually render the table
          this.dtTrigger.next();
        },
        error => {
          console.log(error);
        });
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.changeStatusId = id;
    this.deleteCategoryId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }

  changeStatus() {
    this.changedStatus = this.changeStatusType == 'Active' ? 'Inactive' : 'Active';
    this.categoryService.changeCategoryStatus(this.changedStatus, this.changeStatusId)
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

  deleteCategory() {
    this.categoryService.deleteCategory(this.deleteCategoryId)
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


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.getAllCategoryList();
    });
  }

}
