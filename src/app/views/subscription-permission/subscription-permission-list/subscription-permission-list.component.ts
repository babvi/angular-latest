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
import { HttpClient } from "@angular/common/http";
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { SubscriptionService } from './../../../_services/subscription.service';

@Component({
  selector: 'app-subscription-permission-list',
  templateUrl: './subscription-permission-list.component.html',
  styleUrls: ['./subscription-permission-list.component.scss']
})
export class SubPermissionListComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  subPermissionList: any[] = [];
  subPermissionListCopy: any[] = [];
  
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  changedStatus: string;
  modalRef: BsModalRef;
  changeStatusType='';
  change_status_id:number;
  dt: DataTables.Api;
  data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  model: any = {};
  constructor(private spinner:NgxUiLoaderService,private subscriptionService: SubscriptionService,private http: HttpClient,private toastr: ToastrService,private modalService: BsModalService,private apiService:ApiService, private permissionsService: NgxPermissionsService) { }
  loader:any;
  ngOnInit() {
    this.loader = CONFIGCONSTANTS.loaderConfig;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: 'title' }, {data: 'allow_free'}, {data: 'allow_paid'}, { data: 'status' }]
    } else {
      columnsArry = [{ data: 'title' }, {data: 'allow_free'}, {data: 'allow_paid'}, { data: 'status' }, { orderable: false, searchable: false }]
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        "searchPlaceholder": 'Search',
      },
      stateSave: true,
      stateSaveCallback: function (settings, data) {
          localStorage.setItem(CONFIGCONSTANTS.subscriptionPermissionList, JSON.stringify(data));
      },
      stateLoadCallback: function () {
        try {
            return JSON.parse(localStorage.getItem(CONFIGCONSTANTS.subscriptionPermissionList));
        } catch (e) {}
      },
      pageLength: 10,
      processing: true,
      columns: columnsArry
    };
    this.getAllEmailList();

  }
  openModal(template: TemplateRef<any>, id, status, index) {
    if(status == 'Edit') {
       this.model = this.subPermissionList[index];
       if(this.model.allow_free > -1) {
        this.model.custom_free = 'custom'
       } else {
        this.model.custom_free = -1;
       }
       if(this.model.allow_paid > -1) {
        this.model.custom_paid = 'custom'
       } else {
        this.model.custom_paid = -1;
       }
    } else {
      this.changeStatusType=status;
      this.change_status_id=id;
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-md', backdrop: 'static' });
  }

  decline(): void {
    this.modalRef.hide();
    this.rerender();
    this.model = {};
  }

  avoidNegative(value){
    if(value < 0){
      value = Math.abs(value);
    }
    if(value == null){
      value = '';
    }
    return value;
  }

  toggleUser(flag) {
    if(flag == 'free') {
      this.model.allow_free = this.model.allow_free == 0 ? 1 : 0;
    } else {
      this.model.allow_paid = this.model.allow_paid == 0 ? 1 : 0;
    }
  }


  getAllEmailList(): void {
    this.spinner.start();
    this.apiService.postRequest(CONFIG.getSubPermissionList, {})
      .pipe(first())
      .subscribe(
        data => {
          this.spinner.stop();
          this.subPermissionList = data['data'];
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
    this.apiService.postRequest(CONFIG.changeSubPermissionStatus,{uuid:this.change_status_id,status:this.changeStatusType == 'Active' ? 'Inactive' : 'Active'})
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

  savePermission (frm: NgForm) {
    if(frm.invalid){
      return;
    }
    if(this.model.custom_free == 'custom' && this.model.allow_free == null && this.model.per_type == 1) { 
      this.toastr.error('Please enter free custom range!');
      return false;
    }
    if(this.model.custom_paid == 'custom' && this.model.allow_paid == null && this.model.per_type == 1) { 
      this.toastr.error('Please enter paid custom range!');
      return false;
    }
    let data = {
      uuid: this.model.uuid,
      allow_free: this.model.allow_free,
      allow_paid: this.model.allow_paid,
      title: this.model.title
    };
    this.subscriptionService.editSubPermissionById(data)
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.decline();
          }
        },
        error => {
          let errorData = error;
          if (errorData && errorData.meta) {
            this.toastr.error(errorData.meta.message);
          } else {
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
