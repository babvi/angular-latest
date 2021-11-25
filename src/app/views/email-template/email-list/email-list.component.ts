import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Email } from './../../../model/email';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApiService } from '../../../_services/api.service';
import { CONFIG } from '../../../config/app-config';
import { ToastrService } from 'ngx-toastr';
import { CONFIGCONSTANTS } from '../../../config/app-constants';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  

  dtOptions: DataTables.Settings = {};
  emailList: Email[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  changedStatus: string;
  modalRef: BsModalRef;
  changeStatusType='';
  change_status_id:number;
  dt: DataTables.Api;
  data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  constructor(private spinner:NgxUiLoaderService,private toastr: ToastrService,private modalService: BsModalService,private apiService:ApiService, private permissionsService: NgxPermissionsService) { }
  loader:any;
  ngOnInit() {
    this.loader = CONFIGCONSTANTS.loaderConfig;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('EMAIL_TEMP_UPDATE') == -1 && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: '', searchable: false }, { data: 'email_subject' }, { data: 'status' }]
    } else {
      columnsArry = [{ data: '', searchable: false }, { data: 'email_subject' }, { data: 'status' }, { orderable: false, searchable: false }]
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        "searchPlaceholder": 'Search',
      },
      stateSave: true,
      pageLength: 10,
      processing: true,
      columns: columnsArry
    };
    this.getAllEmailList();

  }
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.changeStatusType=status;
    this.change_status_id=id;
  }

  decline(): void {
    this.modalRef.hide();
  }


  getAllEmailList(): void {
    this.spinner.start();
    this.apiService.getRequest(CONFIG.getAllEmailListURL)
      .pipe(first())
      .subscribe(
        data => {
          this.spinner.stop();
          this.emailList = data.data;
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
      this.getAllEmailList();
    });
  }

  changeStatus() {
    this.spinner.start();
    this.changedStatus = this.changeStatusType == 'Active' ? 'Inactive' : 'Active';
    this.apiService.putRequest(CONFIG.emailTemplateStatusChangeURL,{id:this.change_status_id,status:this.changeStatusType == 'Active' ? 'Inactive' : 'Active'})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.spinner.stop();
            this.modalRef.hide();
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
    var element=document.getElementById('example_info');
    
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
