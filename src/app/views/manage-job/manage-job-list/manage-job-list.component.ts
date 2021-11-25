import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { JobService } from './../../../_services/managejob.service';
import { Manageuser } from './../../../model/manageuser';
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
import { ApiService } from '../../../_services/api.service';
import { Employer } from '../../../model/manage-employers';
import { NgxUiLoaderService} from 'ngx-ui-loader';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as _ from "lodash";
@Component({
  selector: 'app-manage-job-list',
  templateUrl: './manage-job-list.component.html',
  styleUrls: ['./manage-job-list.component.scss']
})
export class ManageJobListComponent implements OnDestroy, OnInit {
  frontURL=environment.frontEndURL;
  jobViewURL = CONFIG.jobViewURL;
  companyProfileURL = CONFIG.companyProfileURL;
  userProfileURL = CONFIG.userProfileURL;
  modalRef: BsModalRef;
  previous_search_json;
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // activeRoleList: Subscription;
  ManagejobList: any[] = [];
  specialistList: any[] = [
    {name: 'Actor', value: 0},
    {name: 'Model', value: 1},
    {name: 'Voiceover', value: 2},
    {name: 'Crew', value: 3}
  ];
  statusList: any[] = [];
  empStatusList: any = {};
  orderByList: any[] = [
    {name: 'newness', value: 'newness'},
    {name: 'relevance', value: 'relevance'}
  ];
  jobStatusList: any[] = [
    {name: 'Draft', value: '1'},
    {name: 'Published', value: '2'},
    {name: 'Closed', value: '3'},
    {name: 'Pending', value: '5'},
    {name: 'Rejected', value: '6'}
  ];
  empty_error_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  date_formate=CONFIGCONSTANTS["date-formate"];
  submitted = false;
  download_file_url='';
  status = '';
  rejection_note:any="";
  job_status = '';
  fullname = '';
  location = '';
  posted_by = '';
  orderBy = this.orderByList[0].name;
  specialist_type='';
  jobID: string;
  varified_status:string;
  start:number;
  sorting_order:number;
  order_drop_down_change;
  actionType:string;
  loader:any;
  is_featured;
  isInit:string = 'NO';
  pageLength:number = 10;
  startPageNumber:number = 0;
  defaultColumn:number = 5;
  defaultSort:string = 'desc';

  // roleList: any;

  constructor(private apiService:ApiService,private jobService: JobService, private toastr: ToastrService,
    private modalService: BsModalService,private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService,private router:Router) { }

  ngOnInit() {
    var getPreviousData = this.apiService.getListingResume(CONFIGCONSTANTS.manageJobList);
    if (getPreviousData) {
      this.isInit = 'YES';
      this.defaultColumn = getPreviousData.order[0].column;
      this.defaultSort = getPreviousData.order[0].dir;
      this.pageLength = getPreviousData.length;
      this.startPageNumber = getPreviousData.start;
      this.status = getPreviousData.employment_status;
      this.fullname = getPreviousData.name;
      this.location = getPreviousData.city;
      this.specialist_type = getPreviousData.specialist_type;
      this.job_status = getPreviousData.status;
      this.posted_by = getPreviousData.posted_by;
    }

    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.sorting_order=0;
    this.order_drop_down_change=false;
    this.getEmploymentStatus();
    this.getAllManageJobListURL();
  }

  /* Getting List Data */
  getAllManageJobListURL() {
    this.spinner.start();
    const that = this;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{data: 'company_name', orderable: false}, { data: 'name' }, { data: 'city' }, { data: 'specialist_type', orderable:false }, {data: 'employment_status', orderable:false }, { data: 'job_status', orderable:false }, { data: 'created_at' }]
    } else {
      columnsArry = [{data: 'company_name', orderable: false}, { data: 'name' }, { data: 'city' }, { data: 'specialist_type', orderable:false }, {data: 'employment_status', orderable:false }, { data: 'job_status', orderable:false }, { data: 'created_at' },{ data: '', orderable: false }];
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      searching: false,
      autoWidth: false,
      processing: true,
      order: [[this.defaultColumn, this.defaultSort]],
      "displayStart": this.startPageNumber,
      
      ajax: (dataTablesParameters: any, callback) => {
        this.previous_search_json=Object.assign(dataTablesParameters,{
          employment_status:this.status, 
          name :this.fullname,
          city: this.location,
          specialist_type:this.specialist_type,
          status: this.job_status == '' ? '' : Number(this.job_status),
          posted_by: this.posted_by
         });


         if (this.isInit == 'YES') {
          this.isInit = 'NO';
          // Get the previous searched and saved data
          this.previous_search_json = this.apiService.getListingResume(CONFIGCONSTANTS.manageJobList);
          var sortOn = this.previous_search_json.order[0];
          // set previous sorting and render
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.order.apply('order',[[sortOn.column, sortOn.dir]]);
          });
        }

         this.apiService.postRequest(CONFIG.getAllManageJobListURL, this.previous_search_json)      
          .pipe(first())
          .subscribe(resp => {

            // Set and store previous data to local
            this.apiService.setListingResume(CONFIGCONSTANTS.manageJobList, this.previous_search_json);

            this.order_drop_down_change=false;
            this.start=this.previous_search_json.start;
            
            this.spinner.stop();
            that.ManagejobList = resp.data['original'].data;
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

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>,id, status,v_s,action_type) {
    
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.jobID = id;
    this.varified_status=v_s;
    this.actionType=action_type;
    if(action_type == 'feature') {
      this.is_featured = v_s;
    }
  }

  decline(): void {
    this.modalRef.hide();
    this.submitted = false;
  }

  declineRejectionNote(): void {
    this.rejection_note = '';
    this.modalRef.hide();
    this.submitted = false;
  }

  // changeVarifiedStatus() {
  //   this.spinner.start();
  //   this.apiService.putRequest(CONFIG.changeCompanyEmployeerVarifiedStatus,{status:(this.varified_status == '0' || this.varified_status == '' )? '1' : '0',action:this.actionType})
  //     .pipe(first())
  //     .subscribe(
  //       data => {
  //         if (data.meta.status == true) {
  //           this.toastr.success(data.meta.message);
  //           // this.rerender();
  //           var that=this;
  //           setTimeout(function(){ that.rerender();that.spinner.stop();that.modalRef.hide();}, 3000);
  //         }
  //       },
  //       error => {
  //         let statusError = error;
  //         if (statusError && statusError.meta) {
  //           this.spinner.stop();
  //           this.toastr.error(statusError.meta.message);
  //         } else {
  //           this.spinner.stop();
  //           this.toastr.error("Something went wrong please try again.");
  //         }
  //       });
  // }

  changeJobFeatured() {
    this.spinner.start();
    this.apiService.putRequest(CONFIG.changeJobFeaturedURL + this.jobID,{is_featured :this.is_featured == 0 ? 1 : 0})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            // this.rerender();
            var that=this;
            that.rerender();that.spinner.stop();that.modalRef.hide();
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

  onJobSave(frm:NgForm)
  {

  }
  deleteManageJob() {
    this.jobService.deleteManageJob(this.jobID)
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

  approveJob() {
    this.spinner.start();
    let note = this.rejection_note;
    this.jobService.approveJob(this.jobID, note)
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
            (statusError.meta.status_code==422) ? this.modalRef.hide() : '';
            this.spinner.stop();
            this.toastr.error(statusError.meta.message);
            this.rerender();
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
        });
  }

  rejectionNoteSubmitHandler(frm:NgForm) {
    if (this.rejection_note=='') {
      this.toastr.error("Please enter Rejection Note");
      return;
    }
    this.rejectJob();
  }

  rejectJob() {
    this.spinner.start();
    let note = this.rejection_note;
    this.jobService.rejectJob(this.jobID, note)
    .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.rejection_note = '';
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
  getEmploymentStatus() {
    this.jobService.getEmploymentStatus()
    .subscribe(
    data => {
      this.statusList = data.data;
      this.statusList.forEach(element => {
        this.empStatusList[element.id] = element.name;
      });
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

  resetSearch() {
    this.status = '';
    this.fullname = '';
    this.location = '';
    this.specialist_type='';
    this.posted_by = '';
    this.job_status = '';
    this.rerender();
  }

  ngOnDestroy(): void {
    // this.activeRoleList.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.draw();
    });
  }
  chnageOrder()
  {
    if(this.sorting_order!=-1)
    {
      this.order_drop_down_change=true;
    this.rerender();
    }
    if(this.sorting_order==-1)
    {
      this.rerender();
    }
  }

  sortBy() {

  }

  check()
  {
    var element=document.getElementById('user_table_info');
    
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
getDateInMMDDYYformate(date)
{
  return moment(date).format('MM/DD/YYYY');
}
downloadReport() {  
  this.previous_search_json.length=Math.floor(Math.random() * 100000000);
  this.spinner.start();
  this.apiService.postRequest(CONFIG.getJobReportCSV,this.previous_search_json)
  .pipe(first())
  .subscribe(
  data => {
    if (data['meta'].status == true) {
      this.spinner.stop();
      // this.modalRef.hide();
      this.download_file_url=data['data'].path;
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      link.href = this.download_file_url;
      link.target='_blank';
      // link.download = this.download_file_url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // this.toastr.success(data['meta'].message);
      //this.rerender();
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
  checkStringEmpty(val: string): Boolean {
    if (_.isEmpty(val) || (val!= undefined && val!=null && val.trim().length == 0)) return true;
    return false;
  }
}
