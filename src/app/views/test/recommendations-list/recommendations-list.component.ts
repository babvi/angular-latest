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
  this.loader = CONFIGCONSTANTS.loaderConfig;
    var columnsArry = [
      {data:'id',searchable: false},
      {data:'first_name'},
      {data:'company_name'},
      {data:'recommendation',searchable: false,orderable: false},
      {searchable: false,orderable: false},
    ];
    this.type=(this.router.url as string).endsWith('user')?'user':'company';
    var permissions = this.permissionsService.getPermissions();
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        "searchPlaceholder": 'Search',
      },
      stateSave: true,
      pageLength: 10,
      processing: true,
      columns: columnsArry,
    };
    this.getList();
  }
  getList()
  {
    this.spinner.start();
    this.apiService.getRequest(this.type=='user'?CONFIG.getUserrecommendationListURL:CONFIG.getCompanyrecommendationListURL)
    .pipe(first())
    .subscribe(
      data => {
        if (data.meta.status == true) {
          this.spinner.stop();
          this.DataList=data.data.original.data;
          // this.toastr.success(data.meta.message);
          //  this.rerender();
          this.dtTrigger.next();
        }
      },
      error => {
        this.spinner.stop();
        let statusError = error;
        if (statusError && statusError.meta) {
          this.toastr.error(statusError.meta.message);
        } else {
          this.toastr.error("Something went wrong please try again.");
        }
      });
  
  }
  deleteRecommendation()
  {
    this.apiService.deleteRequest((this.type=='user'?CONFIG.deleteUserrecommendationURL:CONFIG.deleteCompanyrecommendationURL)+this.delete_recommendation_uuid,{})
    .subscribe(
      data => {
        if (data.meta.status == true) {
          this.toastr.success(data.meta.message);
          this.rerender();
          this.modalRef.hide();
        }
      },
      error => {
        let statusError = error;
        console.log(error);
        
        if(error.meta.message)
        {
          this.toastr.error(error.meta.message);
        }
        else
        {
          this.toastr.error("Something went wrong please try again.");
        }
        
        this.modalRef.hide();
      });
  }
  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.getList();
    });
  }
  openModal(template: TemplateRef<any>,data,delete_uuid) {
    this.recommendation_modal_data=data;
    this.delete_recommendation_uuid=delete_uuid;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  decline(): void {
    this.recommendation_modal_data='';
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
}
