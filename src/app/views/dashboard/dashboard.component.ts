import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ViewChildren,ElementRef,QueryList } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { JobService } from './../../_services/managejob.service';
import { Router } from '@angular/router';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import  * as moment from 'moment';
import { ApiService } from '../../_services/api.service';
import { CONFIG } from '../../config/app-config';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService} from 'ngx-ui-loader';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CONFIGCONSTANTS } from '../../config/app-constants';

import { NgForm } from '@angular/forms';
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
empty_error_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  date_formate=CONFIGCONSTANTS["date-formate"];
ManagejobList: any[] = [];
ManageuserList: any[] = [];
ManageNewjobList: any[] = [];
modalRef: BsModalRef;
@ViewChildren(DataTableDirective)
//datatableElement: DataTableDirective;
//dtElements: QueryList<any>;
//dtOptions: DataTables.Settings = {};
//dtuOptions: DataTables.Settings = {};
//dtnOptions: DataTables.Settings = {};
    
dtElements: QueryList<any>;
dtOptions: DataTables.Settings[] = [];

specialistList: any[] = [
    {name: 'Actor', value: 0},
    {name: 'Model', value: 1},
    {name: 'Voiceover', value: 2},
    {name: 'Crew', value: 3}
  ];
  statusList: any[] = [];
  empStatusList: any[] = [];
  orderByList: any[] = [
    {name: 'newness', value: 'newness'},
    {name: 'relevance', value: 'relevance'}
  ];
  jobStatusList: any[] = [
    {name: 'Draft', value: '1'},
    {name: 'Published', value: '2'},
    {name: 'Closed', value: '3'}
  ];

 companyProfileURL = CONFIG.companyProfileURL;
 submitted = false;
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
  user_type='';
  company_name = '';
  userID: number;
  changeStatusType: string;
  changedStatus: string;
  
  model={
    total_employers:0,
    total_job_seekers:0,
    total_jobs:0,
    totalusers:0,
    getpremiumuser:0,
    getpaymetsubscriptionamount:0,
    getactivesubscription:0,
    totalactor:0,
    totalmodel:0,
    totalvoiceover:0,
    totalcrew:0,
    totalindivudalemployer:0,
    totalcompanyemployer:0,
    totalhiredcount:0
  };
  ranges={
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 15 Days': [moment().subtract(14, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
 }
  values:any[]=[
    {
      value:'Last 7 Days',
      range:(moment().subtract(6, 'days')).format('DD/MM/YYYY')+' To '+moment().format('DD/MM/YYYY'),
      days:7
    },
    {
      value:'Last 15 Days',
      range:(moment().subtract(14, 'days')).format('DD/MM/YYYY')+' To '+moment().format('DD/MM/YYYY'),
      days:15
    },
    {
      value:'Last 30 Days',
      range:(moment().subtract(29, 'days')).format('DD/MM/YYYY')+' To '+moment().format('DD/MM/YYYY'),
      days:30
    }
  ]
  selected_days;
  number_of_days:number;

  
      
   constructor(private apiService:ApiService,private jobService: JobService,private modalService: BsModalService,
           private toastr: ToastrService,private spinner:NgxUiLoaderService)
    {
    
       
    };

  ngOnInit(): void {
    this.selected_days={
     startd:moment(),
      end:moment()
     };
    // generate random values for mainChart
    // for (let i = 0; i <= this.mainChartElements; i++) {
    //   this.mainChartData1.push(this.random(50, 200));
    //   this.mainChartData2.push(this.random(80, 100));
    //   this.mainChartData3.push(65);
    // }
    this.getDashBoardData();
    this.getDashboarStaticsData();
    this.getActiveJobList();
    this.getUnverifiedCompany();
    this.getAllnewpostedjobs();
  }
    // radioModel: string = 'Month';

    
    
    getDashBoardData() {
      var end = moment(this.selected_days.end).format('YYYY-MM-DD');
      var from = moment(this.selected_days.startd).format('YYYY-MM-DD');
      this.apiService.postRequest(CONFIG.getDashboardDataURL,{
        from_date:from,
        to_date:end,
      })
        .subscribe(
          data => {
            if (data.meta.status == true) {

              this.model.total_employers=data.data.total_employers;
              this.model.total_jobs=data.data.total_jobs;
              this.model.total_job_seekers=data.data.total_job_seekers;
              this.model.totalactor=data.data.totalactor;
              this.model.totalmodel=data.data.totalmodel;
              this.model.totalvoiceover=data.data.totalvoiceover;
              this.model.totalcrew=data.data.totalcrew;
              this.model.totalindivudalemployer=data.data.totalindivudalemployer;
              this.model.totalcompanyemployer=data.data.totalcompanyemployer;
              this.model.totalhiredcount=data.data.totalhiredcount;
            }
          },
          error => {
            let statusError = error;
            if (statusError && statusError.meta) {

            } else {

            }
          });
    }  
    
      getDashboarStaticsData(){
          this.apiService.postRequest(CONFIG.getDashboardDatastaticsURL,{})
      .subscribe(
        data=>{
           if (data.meta.status == true) {

              this.model.totalusers=data.data.totalusers;
              this.model.getpremiumuser=data.data.getpremiumuser; 
              this.model.getpaymetsubscriptionamount=data.data.getsubamount;
              this.model.getactivesubscription=data.data.getactivesubscription;
            }
         },
       error=>{ 
          let statusError = error;
            if (statusError && statusError.meta) {

            } else {

            }
        } 
        );
      }
      
      
    
    /* Getting Active jobs */
      getActiveJobList() {
         const that = this;
         let columnsArry = [];
         columnsArry = [{data: 'company_name', orderable: false}, { data: 'name' }, { data: 'city' }, { data: 'specialist_type', orderable:false }, {data: 'employment_status', orderable:false }, { data: 'job_status', orderable:false }, { data: 'created_at' }],
         this.dtOptions[0] = {
           pagingType: 'full_numbers',
           pageLength: 10,
           serverSide: true,
           searching: false,
           autoWidth: false,
           processing: true,
           order: [[6, 'desc']],
           
          ajax: (dataTablesParameters: any, callback) => {  
          
            this.apiService.postRequest(CONFIG.getAllactivejobsURL,Object.assign(dataTablesParameters,{
              employment_status:this.status, 
              name :this.fullname,
              city: this.location,
              //orderBy: this.orderBy,
              specialist_type:this.specialist_type,
              status: this.job_status == '' ? '' : Number(this.job_status),
              posted_by: this.posted_by
              //limit: dataTablesParameters.length,
              //currentPage: (dataTablesParameters.start / dataTablesParameters.length) + 1,
             }))   
             .pipe(first())
              .subscribe(resp => {
                this.order_drop_down_change=false;
                this.start=dataTablesParameters.start;

                //this.spinner.stop();
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
      };
      
      
      
      
      /* Getting Unverified company */
      getUnverifiedCompany() {
         const that = this;
         let columnsuArry = [];
         columnsuArry = [{data:'created_at',orderable:false},{ data: 'full_name',orderable:true }, { data: 'company_name',orderable:true }, { data: 'email' }, { data: 'city' }, { data: 'user_type' }, { data: 'status' }, { data: 'created_at' }],
         this.dtOptions[1] = {
           pagingType: 'full_numbers',
           pageLength: 10,
           serverSide: true,
           searching: false,
           autoWidth: false,
           processing: true,
           order: [[6, 'desc']],
           
          ajax: (dataTablesParameters: any, callback) => {  
          
            this.apiService.postRequest(CONFIG.getUnverifiedcompanyURL,Object.assign(dataTablesParameters,{
              status:this.status, 
              location:this.location,
              name :this.fullname,
              user_type:this.user_type,
              company_name: this.company_name
             }))   
             .pipe(first())
              .subscribe(resp => {
                this.order_drop_down_change=false;
                this.start=dataTablesParameters.start;

                //this.spinner.stop();
                that.ManageuserList = resp.data['original'].data;
                callback({
                  recordsTotal: resp.data['original'].recordsTotal,
                  recordsFiltered: resp.data['original'].recordsFiltered,
                  data: []
                });
              });
          },
          columns: columnsuArry
         };
      };
      
      /* Getting New jobs */
      getAllnewpostedjobs() {
         const that = this;
         let columnnewArry = [];
         columnnewArry = [{data: 'company_name', orderable: false}, { data: 'name' }, { data: 'city' }, { data: 'specialist_type', orderable:false }, {data: 'employment_status', orderable:false }, { data: 'job_status', orderable:false }, { data: 'created_at' },{ data: '', orderable: false }],
         this.dtOptions[2] = {
           pagingType: 'full_numbers',
           pageLength: 10,
           serverSide: true,
           searching: false,
           autoWidth: false,
           processing: true,
           order: [[6, 'desc']],
           
          ajax: (dataTablesParameters: any, callback) => {  
          
            this.apiService.postRequest(CONFIG.getAllnewpostedjobsURL,Object.assign(dataTablesParameters,{
              employment_status:this.status, 
              name :this.fullname,
              city: this.location,
              //orderBy: this.orderBy,
              specialist_type:this.specialist_type,
              status: this.job_status == '' ? '' : Number(this.job_status),
              posted_by: this.posted_by
              //limit: dataTablesParameters.length,
              //currentPage: (dataTablesParameters.start / dataTablesParameters.length) + 1,
             }))   
             .pipe(first())
              .subscribe(resp => {
                this.order_drop_down_change=false;
                this.start=dataTablesParameters.start;

                //this.spinner.stop();
                that.ManageNewjobList = resp.data['original'].data;
                callback({
                  recordsTotal: resp.data['original'].recordsTotal,
                  recordsFiltered: resp.data['original'].recordsFiltered,
                  data: []
                });
              });
          },
          columns: columnnewArry
         };
      };
      
      
      
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
  };
  
  
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
            this.rerender(2);
          }
        },
        error => {
          let statusError = error;
          if (statusError && statusError.meta) {
            (statusError.meta.status_code==422) ? this.modalRef.hide() : '';
            this.toastr.error(statusError.meta.message);
            this.rerender(2);
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
            this.rerender(2);
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
  
  decline(): void {
    this.modalRef.hide();
    this.submitted = false;
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
      
  /* Open any Modal Popup */
  openModalcomp(template: TemplateRef<any>,id, status,v_s,action_type) {
    
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    this.userID = id;
    this.changeStatusType = status;
    this.varified_status=v_s;
    this.actionType=action_type;
  }
  
  declineRejectionNote(): void {
    this.rejection_note = '';
    this.modalRef.hide();
    this.submitted = false;
  }
      
    rerender(dtValue): void {
      this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if(index==dtValue){
        dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.draw();
        });
      }      
    });    
   }
      
    getDateInMMDDYYformate(date)
    {
      return moment(date).format('MM/DD/YYYY');
    }
      
  checkStringEmpty(val: string): Boolean {
    if (val!= undefined && val!=null && val.trim().length == 0) return true;
    return false;
  }
  
  changeJobFeatured() {
    this.spinner.start();
    this.apiService.putRequest(CONFIG.changeJobFeaturedURL + this.jobID,{is_featured :this.is_featured == 0 ? 1 : 0})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            // this.rerender(0);
            var that=this;
            that.rerender(0);that.spinner.stop();that.modalRef.hide();
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
deleteManageJob() {
    this.jobService.deleteManageJob(this.jobID)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.modalRef.hide();
            this.toastr.success(data.meta.message);
            this.rerender(0);
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
  
  changeVarifiedStatus() {
    this.spinner.start();
    this.apiService.putRequest(CONFIG.changeCompanyEmployeerVarifiedStatus+this.userID,{status:(this.varified_status == '0' || this.varified_status == '' )? '1' : '0',action:this.actionType})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            // this.rerender(2);
            var that=this;
            setTimeout(function(){ that.rerender(1);that.spinner.stop();that.modalRef.hide();}, 3000);
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
  
  }