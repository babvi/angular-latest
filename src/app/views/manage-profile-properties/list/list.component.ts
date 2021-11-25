import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileProperty } from './../../../model/profile-properties';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CONFIG } from './../../../config/app-config';
import * as moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from './../../../_services/api.service';
import * as $ from 'jquery';
import { log } from 'util';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
    selector: 'app-campaign-ads-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnDestroy, OnInit {
    modalRef: BsModalRef;
    @ViewChild(DataTableDirective)
    datatableElement: DataTableDirective;
    loader:any;
    dtOptions: DataTables.Settings = {};
    profilePropertyList: ProfileProperty[];
    dtTrigger: Subject<any> = new Subject();
    skillName:string='';
    uuid: String;
    status: Number;
    propertyType: string = "";
    propertyTypeList: string[];
    data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
    datatableColumns: Object[]  = [
        { data: 'id', searchable: false},
        { data: 'name' },
        { data: 'Is Active?', orderable: true },
        { data: 'property_type'},
        { orderable: false, searchable: false }
    ];
    disableBtn:boolean=false;
    constructor(
        private toastr: ToastrService,
        private spinner:NgxUiLoaderService,
        private route: ActivatedRoute,
        public _location: Location,
        private modalService: BsModalService,
        private permissionsService: NgxPermissionsService,
        private apiService: ApiService
    ) { }

    ngOnInit() {

        this.loader = CONFIGCONSTANTS.loaderConfig;
        this.spinner.start();
        this.profilePropertyList=[];
        this.dtOptions = {
            pagingType: 'full_numbers',
            language: {
                "search": "",
                'searchPlaceholder': 'Search...',
                "emptyTable":"NoData!"
            },

            searching:true,
            stateSave: true,
            pageLength: 10,
            processing: true,
            columns: this.datatableColumns            
        };
        this.getPropertyTypes();
        var getPreviousData = this.apiService.getListingResume(CONFIGCONSTANTS.skillManagementList);
        if (getPreviousData) {
            this.propertyType = getPreviousData.property_type;
            this.skillName = getPreviousData.name;
        }
        this.getList();
        this.spinner.stop();
    }

    /**
     * Get listing record
     */
    getList(): void {
        this.disableBtn=true;
        this.apiService.postRequest(CONFIG.profileProperties.getListingURL, { 'property_type': this.propertyType,'name':this.skillName.trim()})
        .pipe(first())
        .subscribe(
            data => {
                var reqData = { 'property_type': this.propertyType,'name':this.skillName.trim()};
                this.apiService.setListingResume(CONFIGCONSTANTS.skillManagementList, reqData);
                this.profilePropertyList = data.data;
                //Calling the DT trigger to manually render the table
                this.dtTrigger.next();
                this.disableBtn=false;
            },
            error => {
                this.disableBtn=false;
                console.log(error);
            });
    }

    /**
     * Get property types
     */
    getPropertyTypes(): void {
        this.apiService.getRequest(CONFIG.profileProperties.getPropertyTypes + (this.propertyType != "" ? '/' + this.propertyType : ""))
            .pipe(first())
            .subscribe(
            data => {
                this.propertyTypeList = data.data;
            },
            error => {
                console.log(error);
            });
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    resetSearch():void {
        this.propertyType = "";
        this.rerender();
    }

    /**
     * Open Modal
     *
     * @param template 
     * @param uuid 
     */
    openModal(template: TemplateRef<any>, uuid, status) {
        this.modalRef = this.modalService.show(template, { class: 'modal-md' });
        this.uuid = uuid;
        this.status = status;
    }

    /**
     * Close Modal
     */
    decline(): void {
        this.modalRef.hide();  
        this.uuid='';
        this.status = 0;
    }

    /**
     * Change Status
     * 
     * @param status 
     */
    changeStatus(): void {
        this.spinner.start();
        //status change method
        this.apiService.putRequest(CONFIG.profileProperties.getChangeStatusURL, { 'uuid': this.uuid, 'is_active': this.status })
            .pipe(first())
            .subscribe((Response: any) => {
                if (Response.meta.status_code == 200) {
                    this.toastr.success(Response.meta.message);
                    this.decline();
                    this.rerender();
                    this.spinner.stop();
                }
            }, (error: any) => {
                this.toastr.error(error.meta.message);
                this.decline();
                this.rerender();
                this.spinner.stop();
            })
    }

    deleteRecord() {
        this.apiService.deleteRequest(CONFIG.profileProperties.getDeleteRecordURL + this.uuid, {})
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

    rerender(): void {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            this.getList();
        });
    }
    reset()
    {
        this.skillName='';
        this.propertyType='';
        this.rerender();
    }
    check()
    {
    
    
      var element=document.getElementById('skillTable_info');
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
    sorrArray(array,key)
          {
                     
            return array.sort(function(a,b){
              if ((a[key] as string).toLowerCase() < (b[key] as string).toLowerCase())
                return -1;
              if ((a[key] as string).toLowerCase() > (b[key] as string).toLowerCase())
                return 1;
              return 0;
            }); 
        }

        
}

