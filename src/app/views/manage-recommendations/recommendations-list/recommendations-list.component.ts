import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApiService } from '../../../_services/api.service';
import { CONFIG } from '../../../config/app-config';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Recommendations } from '../../../model/recommendations';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { first } from 'rxjs/operators';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-recommendations-list',
  templateUrl: './recommendations-list.component.html',
  styleUrls: ['./recommendations-list.component.scss']
})
export class RecommendationsListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  modalRef: BsModalRef;
  dtOptions: DataTables.Settings = {};
  DataList:Recommendations[]=[];
  dtTrigger: Subject<any> = new Subject();
  type:string;
  columnsArry;
  recommendation_modal_data:string;
  delete_recommendation_uuid:string;
  loader:any;
  data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  search_param:string;
  user_type:string;
  status_recommendation_id;
  status_recommendation_status;
  status_recommendation_type;
  first_time_loaded=false;
  companyProfileURL = CONFIG.companyProfileURL;
  userProfileURL = CONFIG.userProfileURL;
  frontURL=environment.frontEndURL;

  isInit:string = 'NO';
  pageLength:number = 10;
  startPageNumber:number = 0;
  defaultColumn:number = 5;
  defaultSort:string = 'desc';
  previous_search_json;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private apiService:ApiService,
    private toastr:ToastrService,
    private modalService: BsModalService,
    private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService
  ) { }

  ngOnInit() {
    var getPreviousData = this.apiService.getListingResume(CONFIGCONSTANTS.manageRecommendationsList);
    if (getPreviousData) {
      this.isInit = 'YES';
      this.defaultColumn = getPreviousData.order[0].column;
      this.defaultSort = getPreviousData.order[0].dir;
      this.pageLength = getPreviousData.length;
      this.startPageNumber = getPreviousData.start;
      this.search_param = getPreviousData.search_param;
      this.user_type = getPreviousData.type;
    }
    this.first_time_loaded=false;
  this.spinner.start();
  this.user_type='user';
  this.loader = CONFIGCONSTANTS.loaderConfig;
    var columnsArry = [
      {data:'created_at'},
      {data:'first_name'},
      {data:'company_name'},
      {data:'recommendation',orderable: false},
      {data:'created_at'},
      {data:null,orderable: false},
    ];
    var columnsArry_2 = [
      {data:'created_at'},
      {data:'first_name'},
      {data:'company_name'},
      {data:'recommendation',orderable: false},
      {data:'created_at'},
      {data:null,orderable: false},
    ];
    var permissions = this.permissionsService.getPermissions();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: this.pageLength,
      "displayStart": this.startPageNumber,
      serverSide: true,
      searching: false,
      autoWidth: false,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        if(this.user_type=='company')
        {
          let a=dataTablesParameters.columns[1];
          let b=dataTablesParameters.columns[2];
          dataTablesParameters.columns[2]=a;
          dataTablesParameters.columns[1]=b;
        }

        this.previous_search_json = Object.assign(dataTablesParameters, {
          search_param:this.search_param,
          type:this.user_type
        });

        if (this.isInit == 'YES') {
          this.isInit = 'NO';
          // Get the previous searched and saved data
          this.previous_search_json = this.apiService.getListingResume(CONFIGCONSTANTS.manageRecommendationsList);
          var sortOn = this.previous_search_json.order[0];
          // set previous sorting and render
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.order.apply('order',[[sortOn.column, sortOn.dir]]);
          });
        }
        this.apiService.postRequest(CONFIG.getRecommendationListURL, this.previous_search_json)      
          .pipe(first())
          .subscribe(resp => {
            // Set and store previous data to local
            this.apiService.setListingResume(CONFIGCONSTANTS.manageRecommendationsList, this.previous_search_json);
            this.spinner.stop();
            this.DataList=resp.data.original.data;
            callback({
              recordsTotal: resp.data['original'].recordsTotal,
              recordsFiltered: resp.data['original'].recordsFiltered,
              data: []
            });
            if(!this.first_time_loaded)
            {
              this.wrap(document.getElementById('recommendation_table'), document.createElement('div'));
              this.first_time_loaded=true;
            }
          });
      },
      columns: columnsArry
      };
  }
  wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    wrapper.classList.add("table-responsive");
  }
  resetSearch()
  {
    this.search_param='';
    this.user_type='user';
    this.rerender();
  }
  changeStatus() {
    this.spinner.start();
    this.apiService.putRequest(CONFIG.changeRecommendationStatusURL+this.status_recommendation_id,
      {is_active:this.status_recommendation_status == 1 ? 0 : 1 ,type:this.status_recommendation_type})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            var that=this;
            // setTimeout(function(){ });
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

  rerender(): void {
    this.user_type=this.user_type==""?'user':this.user_type;
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }
  openModal(template: TemplateRef<any>,data,id,status,type) {
    this.recommendation_modal_data=data;
    this.status_recommendation_id=id;
    this.status_recommendation_status=status;
    this.status_recommendation_type=type;
    console.log(id)
    console.log(status)
    console.log(type)
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  decline(): void {
    this.recommendation_modal_data='';
    this.status_recommendation_id='';
    this.status_recommendation_status='';
    this.status_recommendation_type='';
    this.modalRef.hide();
  }
  check()
  {
    var element=document.getElementById('recommendation_table_info');
    
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
}
