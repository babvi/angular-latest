import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CmsService } from './../../../_services/cms.service';
import { Cms } from './../../../model/cms';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-cms-list',
  templateUrl: './cms-list.component.html',
  styleUrls: ['./cms-list.component.scss']
})
export class CmsListComponent implements OnDestroy, OnInit {
  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  cmsList: Cms[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  changeStatusId: number;
  changeStatusType: string;
  changedStatus: string;
  data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  loader:any;
  constructor(private cmsService: CmsService, private toastr: ToastrService,private spinner:NgxUiLoaderService,
    private modalService: BsModalService, private permissionsService: NgxPermissionsService) { }

  ngOnInit() {

    this.loader = CONFIGCONSTANTS.loaderConfig;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    // debugger
    if (permsn.indexOf('CMS_STATUS') == -1 && permsn.indexOf('CMS_UPDATE') == -1 && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: '', searchable: false }, { data: 'page_title' }, { data: 'status' }];
    } else {
      columnsArry = [{ data: '', searchable: false }, { data: 'page_title' }, { data: 'status' }, { orderable: false, searchable: false }];
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        "searchPlaceholder": 'Search',
      },
      stateSave: true,
      pageLength: 10,
      columns: columnsArry
    };
    this.getAllCmsList();
    // this.http.get<any>(CONFIG.getAllCmsListURL)
    //   .map(this.extractData)
    //   .subscribe(cmsList => {
    //     this.cmsList = cmsList;
    //     // Calling the DT trigger to manually render the table
    //     this.dtTrigger.next();
    // id' });
  }

  getAllCmsList(): void {
    this.spinner.start();
    this.cmsService.getAllCmsList()
      .pipe(first())
      .subscribe(
        data => {
          this.cmsList = 
          data.data;
          this.spinner.stop();
          //Calling the DT trigger to manually render the table
          this.dtTrigger.next();
        },
        error => {
          this.spinner.stop();
          console.log(error);
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
      this.getAllCmsList();
    });
  }


  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.changeStatusId = id;
    this.changeStatusType = status;
  }

  confirm(): void {
    this.changeStatus(this.changeStatusId, this.changeStatusType);
  }

  decline(): void {
    this.modalRef.hide();
  }

  changeStatus(id, status) {
    this.spinner.start();
    this.changedStatus = status == 'Active' ? 'Inactive' : 'Active';
    this.cmsService.changeCmsStatus(this.changedStatus, id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            
            this.modalRef.hide();
            this.spinner.stop();
            this.toastr.success(data.meta.message);
            this.rerender();
          }
        },
        error => {
          let statusError = error;
          if (statusError && statusError.meta) {
            this.spinner.stop();
            this.toastr.error(statusError.meta.message);
          } else {
            this.spinner.stop();
            this.toastr.error("Something went wrong please try again.");
          }
        });
  }

  check()
  {
    var element=document.getElementById('cmsTable_info');
    
    if(element!=null)
    {
      var arr=element.innerHTML.split(' ');
      if(arr[1]=='0' && arr[3]=='0')
      {
        return true;
      }      
    }
    return false;    
  }


}
