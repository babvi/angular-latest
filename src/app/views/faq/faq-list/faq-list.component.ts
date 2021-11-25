import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FaqService } from './../../../_services/faq-service';
import { Faq } from './../../../model/faq';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnDestroy, OnInit {

  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  faqList: Faq[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  changeStatusId: number;
  deleteFaqId: number;
  changeStatusType: string;
  changedStatus: string;


  constructor(private faqService: FaqService, private toastr: ToastrService,
    private modalService: BsModalService, private permissionsService: NgxPermissionsService) { }

  ngOnInit() {

    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('FAQ_UPDATE') == -1, permsn.indexOf('FAQ_DELETE') == -1, permsn.indexOf('FAQ_STATUS') == -1  && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: '', searchable: false }, { data: 'question' }, { data: 'faq_topic.topic_name' }, { data: 'created_at' }, { data: 'status' }]
    } else {
      columnsArry = [{ data: '', searchable: false }, { data: 'question' }, { data: 'faq_topic.topic_name' }, { data: 'created_at' }, { data: 'status' }, { orderable: false, searchable: false }]
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        "searchPlaceholder": 'Search...',
      },
      stateSave: false,
      pageLength: 10,
      processing: true,
      columns: columnsArry
    };
    this.getAllFaqList();

  }

  getAllFaqList(): void {
    this.faqService.getAllFaqList()
      .pipe(first())
      .subscribe(
        data => {
          this.faqList = data.data;
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
    this.deleteFaqId = id;
    this.changeStatusType = status;
  }

  decline(): void {
    this.modalRef.hide();
  }

  changeStatus() {
    this.changedStatus = this.changeStatusType == 'Active' ? 'Inactive' : 'Active';
    this.faqService.changeFaqStatus(this.changedStatus, this.changeStatusId)
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

  deleteFAQ() {
    this.faqService.deleteFaq(this.deleteFaqId)
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
      // Call the dtTrigger to rerender again
      //this.dtTrigger.next();
      this.getAllFaqList();
    });
  }

}
