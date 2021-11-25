import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
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
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as $ from 'jquery';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-talent-crew-list',
  templateUrl: './talent-crew-list.component.html',
  styleUrls: ['./talent-crew-list.component.scss']
})
export class TalentCrewListComponent implements OnInit {
  frontURL=environment.frontEndURL;
  userProfileURL = CONFIG.userProfileURL;
  modalRef: BsModalRef;
  public $=$;
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  date_formate=CONFIGCONSTANTS["date-formate"];
  // activeRoleList: Subscription;
   TalentCrewList=[];
   start=0;
   fullname:string="";
   changeStatusId;
   changedStatus;
   element;
   arr:string[];
   specilitytype;
   isInit:string = 'NO';
   pageLength:number = 10;
   startPageNumber:number = 0;
   defaultColumn:number = 5;
   defaultSort:string = 'desc';
     startj = '';
  endj = '';
   model={
    search_param:'',
    specialization:'',
    location:'',
    status:'',
    min_created_at:'',
    max_created_at:''
   }
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
   download_file_url='';
   previous_search_json;
   specia='';
   start_page:number;
   search_button_disabled:boolean;
   loader:any;
  dropdownSettings
   empty_table_msg=CONFIGCONSTANTS["Data-Table-Empty-error"];
  constructor(private apiService:ApiService, private toastr: ToastrService,
    private modalService: BsModalService,private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService,private route: ActivatedRoute) { }
  ngOnInit() {
    this.specilitytype = this.route.snapshot.queryParamMap.get('stype');
    this.startj = this.route.snapshot.queryParamMap.get('startj');
    this.endj = this.route.snapshot.queryParamMap.get('endj');
   
   
    if(this.specilitytype!='' && this.specilitytype!=null) {
     this.model.specialization = this.specilitytype;
    }
    
    if(this.startj!='' && this.startj!=null && this.endj!='' && this.endj!=null && this.startj!='Invalid date' && this.endj!='Invalid date'){
     
        this.selected_days = {
            start:moment(this.startj),
            end:moment(this.endj)
          };
      }
    var getPreviousData = this.apiService.getListingResume(CONFIGCONSTANTS.talentAndCrewList);
    if (getPreviousData && this.specilitytype=='') {
      this.isInit = 'YES';
      this.defaultColumn = getPreviousData.order[0].column;
      this.defaultSort = getPreviousData.order[0].dir;
      this.pageLength = getPreviousData.length;
      this.startPageNumber = getPreviousData.start;
      this.model.search_param = getPreviousData.search_param;
      this.model.location = getPreviousData.location;
      this.model.status = getPreviousData.status;
      this.model.specialization = getPreviousData.specialization_key;
      if (getPreviousData.date_obj && getPreviousData.date_obj.start && getPreviousData.date_obj.end) {
        this.selected_days = {
          start:moment(getPreviousData.date_obj.start),
          end:moment(getPreviousData.date_obj.end)
        };
      }
    }
    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.search_button_disabled=false;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
  };
    this.spinner.start();
    var columnsArry = [
      {data:'first_name'},
      { data: 'email' },
      { data: 'gender' },
       { data: 'status' },
       { data: '', orderable: false },
       { data: 'created_at' },
        { data: '', orderable: false },
        {data:'',orderable:false},
         { data: 'created_at' },
          { orderable:false }];

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
        this.start=dataTablesParameters.start;        
        var val=this.model.specialization;
        this.previous_search_json = Object.assign(dataTablesParameters,{
          search_param:this.model.search_param,
          [this.model.specialization]:1,
          location:this.model.location,
          status:this.model.status,
          min_created_at: this.selected_days.start?moment(this.selected_days.start).format('YYYY-MM-DD'):"",
          max_created_at: this.selected_days.end?moment(this.selected_days.end).format('YYYY-MM-DD'):"",
         });

          // If is init then check with existing data
          if (this.isInit == 'YES') {
            this.isInit = 'NO';
            // Get the previous searched and saved data
            this.previous_search_json = this.apiService.getListingResume(CONFIGCONSTANTS.talentAndCrewList);
            var sortOn = this.previous_search_json.order[0];
            // set previous sorting and render
            this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.order.apply('order',[[sortOn.column, sortOn.dir]]);
            });
          }

        this.apiService.postRequest(CONFIG.getTalentCrewListURL,Object.assign(dataTablesParameters,{
          search_param:this.model.search_param,
          [this.model.specialization]:1,
          location:this.model.location,
          status:this.model.status,
          min_created_at: this.selected_days.start?moment(this.selected_days.start).format('YYYY-MM-DD'):"",
          max_created_at: this.selected_days.end?moment(this.selected_days.end).format('YYYY-MM-DD'):"",
          
        }))      
          .pipe(first())
          .subscribe(resp => {
            // Added specialization
            this.previous_search_json['specialization_key'] = this.model.specialization;
            // Add date object to the local instance data
            this.previous_search_json['date_obj'] = this.selected_days;
            // Set and store previous data to local
            this.apiService.setListingResume(CONFIGCONSTANTS.talentAndCrewList, this.previous_search_json);
            this.spinner.stop();
            //this.start=dataTablesParameters.start;
            this.start=this.previous_search_json.start;
            this.TalentCrewList = resp.data['original'].data;
            // this.TalentCrewList.forEach((element,index)=>{
            //   element['index']=index+1;
            // })
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

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  decline(): void {
    this.modalRef.hide();
  }
  resetSearch()
  {
    this.model.search_param='';
    this.model.status='';
    this.model.specialization='';
    this.model.min_created_at='';
    this.model.max_created_at='';
    this.specilitytype='';
    this.model.location='';
    this.selected_days = '';
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.order.apply('order',[[5, 'desc']]);
    });
    this.rerender();
  }
  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.changeStatusId = id;
    this.changedStatus = status;
  }
  changeStatus() {
    this.spinner.start();
    this.apiService.putRequest(CONFIG.changeStatusTalentCrewURL+this.changeStatusId,{status:this.changedStatus == 'Active' ? 'Inactive' : 'Active'})
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
  fromDateChange()
  {
      this.model.max_created_at='';
  }
  getDateInFormate(date)
  {
   return moment(date).format(CONFIGCONSTANTS["date-formate"]);
  }
  getDateInMMDDYYformate(date)
  {
    return moment(date).format('MM/DD/YYYY');
  }


  downloadReport() {  
    this.previous_search_json.length=Math.floor(Math.random() * 100000000);
    this.spinner.start();
    this.apiService.postRequest(CONFIG.getTalentReport,this.previous_search_json)
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
  downloadReportPDF() {  
    this.spinner.start();
    this.apiService.postRequest(CONFIG.getTalentReportPDF,this.previous_search_json)
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
}
