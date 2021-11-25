import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { ManageuserService } from './../../../_services/manageuser-service';
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
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnDestroy, OnInit {
  frontURL=environment.frontEndURL;
  companyProfileURL = CONFIG.companyProfileURL;
  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
  };
  // activeRoleList: Subscription;
  ManageuserList: Employer[] = [];
  empty_error_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  date_formate=CONFIGCONSTANTS["date-formate"];
  submitted = false;
  newpass: string;
  download_file_url='';
  countries=[];
  status = '';
  fromDate='';
  toDate='';
  location=''
  fullname = '';
  user_type='';
  company_name = '';
  confirmpass: string;
  userID: number;
  changeStatusType: string;
  changedStatus: string;
  varified_status:string;
  start:number;
  sorting_order:number;
  order_drop_down_change;
  actionType:string;
  previous_search_json;
  loader:any;
  isInit:string = 'NO';
  resumeData = [];
  startPageNumber:number = 0;
  pageLength:number = 10;
  suser_type = '';
  startj = '';
  endj = '';
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
  // roleList: any;

  constructor(private apiService:ApiService,private manageuserService: ManageuserService, private toastr: ToastrService,
    private modalService: BsModalService,private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService,private route: ActivatedRoute) { }

  ngOnInit() {
      this.suser_type = this.route.snapshot.queryParamMap.get('type');
      this.startj = this.route.snapshot.queryParamMap.get('startj');
      this.endj = this.route.snapshot.queryParamMap.get('endj');
      if((this.suser_type!='' && this.suser_type!=null)){
        this.user_type = this.suser_type;
         
      }
      
      if(this.startj!='' && this.startj!=null && this.endj!='' && this.endj!=null && this.startj!='Invalid date' && this.endj!='Invalid date'){
     
        this.selected_days = {
            start:moment(this.startj),
            end:moment(this.endj)
          };
      }

      var rsData = this.apiService.getListingResume(CONFIGCONSTANTS.manageEmployersList);
      //console.log(rsData);
      if (rsData && this.suser_type=='') {
      
        this.isInit = 'YES';
        this.fullname = rsData.name;
        this.status = rsData.status;
        if (rsData.date_obj && rsData.date_obj.start && rsData.date_obj.end) {
          this.selected_days = {
            start:moment(rsData.date_obj.start),
            end:moment(rsData.date_obj.end)
          };
        }
        this.location = rsData.location;
        
        this.user_type = rsData.user_type;
        this.company_name = rsData.company_name;
        this.resumeData = rsData;
        this.startPageNumber = rsData.start;
        this.pageLength = rsData.length;
      }
    
    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.sorting_order=0;
    this.order_drop_down_change=false;
    this.getAllManageUserListURL();
  }

  /* Getting List Data */
  getAllManageUserListURL() {
    this.spinner.start();
    const that = this;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('SUB_ADMIN_UPDATE') == -1 && permsn.indexOf('SUB_ADMIN_DELETE') == -1 && permsn.indexOf('SUB_ADMIN_CHANGE_PASSWORD') == -1 && permsn.indexOf('SUB_ADMIN_STATUS') == -1 && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{data:'created_at',orderable:false},{ data: 'full_name',orderable:true }, { data: 'company_name',orderable:true }, { data: 'email' }, { data: 'city' }, { data: 'user_type' }, { data: 'status' }, { data: 'created_at' }]
    } else {
      columnsArry = [{data:'created_at',orderable:false},{ data: 'full_name',orderable:true }, { data: 'company_name',orderable:true }, { data: 'email' },{ data: 'city' }, { data: 'user_type' }, { data: 'status' }, { data: 'created_at' },{ data: '', orderable: false }];
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      serverSide: true,
      searching: false,
      autoWidth: false,
      processing: true,
      "displayStart": this.startPageNumber,
      ajax: (dataTablesParameters: any, callback) => {
       
       var now_sort=dataTablesParameters.order[0].column;
        var a=dataTablesParameters;
        var sort_index=0;
        if(now_sort>0 && this.order_drop_down_change==false)
        {
          this.sorting_order=-1;
        }

        if(now_sort>0 && this.order_drop_down_change===true)
        {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.order.apply('order',[[0, 'desc']]);
         });
          now_sort=0;
        }
        if(this.sorting_order==1 && now_sort==0)
        {
          a.columns.push({
            data: "_score",
            name: "",
            orderable: true,
            search:{
              regex: false,
              value: ""
            },
            searchable: true
          })
          a.columns.forEach((element,index) => {
            if(element.data=='_score')
            {
              sort_index=index;
            }
            
          });
          a.order=[{
            column: sort_index,
            dir: "desc"
          }]
        }
        if((this.sorting_order==0||this.sorting_order==-1) && now_sort==0)
        {
          a.columns.forEach((element,index) => {
            if(element.data=='created_at')
            {
              sort_index=index;
            }
          });
          a.order=[{
            column: sort_index,
            dir: "desc"
          }]       
        }
        this.previous_search_json= Object.assign(dataTablesParameters,{
          status:this.status, 
          min_created_at: this.selected_days.start?moment(this.selected_days.start).format('YYYY-MM-DD'):"",
          max_created_at: this.selected_days.end?moment(this.selected_days.end).format('YYYY-MM-DD'):"",
          location:this.location,
          name :this.fullname,
          user_type:this.user_type,
          company_name: this.company_name
         })
         // If is init then check with existing data
         if (this.isInit == 'YES') {
             this.isInit = 'NO';

             // Get the previous searched and saved data
             this.previous_search_json = this.apiService.getListingResume(CONFIGCONSTANTS.manageEmployersList);
             var sortOn = this.previous_search_json.order[0];

             // set previous sorting and render
             this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
               dtInstance.order.apply('order',[[sortOn.column, sortOn.dir]]);
              });
         }

         this.apiService.postRequest(CONFIG.getAllEmployeerList, this.previous_search_json)
          .pipe(first())
          .subscribe(resp => {

            // Add date object to the local instance data
            this.previous_search_json['date_obj'] = this.selected_days;

            // Set and store previous data to local
            this.apiService.setListingResume(CONFIGCONSTANTS.manageEmployersList, this.previous_search_json);
            this.order_drop_down_change=false;
            //this.start=dataTablesParameters.start;
            this.start=this.previous_search_json.start;
            
            this.spinner.stop();
            that.ManageuserList = resp.data['original'].data;
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
    this.userID = id;
    this.changeStatusType = status;
    this.varified_status=v_s;
    this.actionType=action_type;
  }

  decline(): void {
    this.modalRef.hide();
    this.newpass = '';
    this.confirmpass = '';
    this.submitted = false;
  }

  changeStatus() {
    this.spinner.start();
    this.changedStatus = this.changeStatusType == 'Active' ? 'Inactive' : 'Active';
    this.apiService.putRequest(CONFIG.changeEmployeerStatus+this.userID,{status:this.changeStatusType == 'Active' ? 'Inactive' : 'Active'})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            var that=this;
            setTimeout(function(){ that.rerender();that.spinner.stop();that.modalRef.hide();}, 3000);
            
            
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

  changeVarifiedStatus() {
    this.spinner.start();
    this.apiService.putRequest(CONFIG.changeCompanyEmployeerVarifiedStatus+this.userID,{status:(this.varified_status == '0' || this.varified_status == '' )? '1' : '0',action:this.actionType})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            // this.rerender();
            var that=this;
            setTimeout(function(){ that.rerender();that.spinner.stop();that.modalRef.hide();}, 3000);
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
  onSubadminSave(frm:NgForm)
  {

  }
  deleteManageUser() {
    this.manageuserService.deleteManageUser(this.userID)
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
    this.status = '';
    this.fromDate='';
    this.toDate='';
    this.location=''
    this.fullname = '';
    this.user_type='';
    this.company_name = '';
    this.selected_days = '';
    this.suser_type = '';
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.order.apply('order',[[0, 'desc']]);
   });
    this.rerender();
  }

  changePassword(changePassFrm: NgForm) {

    this.submitted = true;
    if (changePassFrm.invalid) {
      return;
    }

    let data = {
      user_id: this.userID,
      new_password: this.newpass,
      confirm_password: this.confirmpass
    }

    this.manageuserService.changeManageUserPassword(data)
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
    // this.activeRoleList.unsubscribe();
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
       dtInstance.draw();
    });
  }
  getFormatedDate(date){
    if(date){
      let month=date.getMonth()+1;
      let day=date.getDate();
      if(month<10){
        month=`0${month}`;
      }
      if(day<10){
        day=`0${day}`;
      }
      return `${date.getFullYear()}-${month}-${day}`;
    }else{
      return '';
    }
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
  downloadReport() {  
    this.previous_search_json.length=Math.floor(Math.random() * 100000000);
    this.apiService.postRequest(CONFIG.getEmployeerReport,this.previous_search_json)
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
    this.apiService.postRequest(CONFIG.getEmployeerReportPDF,this.previous_search_json)
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
 getDateInFormate(date)
 {
  return moment(date).format(CONFIGCONSTANTS["date-formate"]);
 }
getDateInMMDDYYformate(date)
{
  return moment(date).format('MM/DD/YYYY');
}
}
