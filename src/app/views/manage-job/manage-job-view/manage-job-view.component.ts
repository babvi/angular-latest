import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewInit, QueryList } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JobService } from './../../../_services/managejob.service';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CONFIG } from '../../../config/app-config';
import { CookieService } from 'ngx-cookie-service';
import { NgxUiLoaderService} from 'ngx-ui-loader';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { DataTableDirective } from 'angular-datatables';
import { ApiService } from '../../../_services/api.service';
import * as moment from 'moment';


@Component({
  selector: 'app-manage-job-view',
  templateUrl: './manage-job-view.component.html',
  styleUrls: ['./manage-job-view.component.scss']
})
export class ManageJobViewComponent implements OnInit {
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings[] = [];
  dtElements: QueryList<any>;
  modalRef: BsModalRef;
  maxDate: any;
  url: string = 'assets/default-user-image.png';  
  profile_image: string;
  noPicture: boolean=false;

  @ViewChild('f') form: any;

  public _id: string;
  viewMode: boolean = false;
  viewUserId: number;
  submitted: boolean = false;
  routeSub: Subscription;
  jobData: Subscription;
  model: any = {};
  viewDetail: any = [];
  statusList: any = [];
  prodTypeList: any = [];
  countries:any[]=[];
  dateFormat:string;
  dobFormat: string;
  isRemoveAPI:boolean=false;
  loader:any;
  constructor(private route: ActivatedRoute,
    private jobService: JobService,
    private router: Router,
    private apiService:ApiService,
    private toastr: ToastrService, private _eref: ElementRef, private cookieService: CookieService, private modalService: BsModalService, private spinner:NgxUiLoaderService) {
      /* Set Maximum Date */
      this.maxDate = new Date();
      this.maxDate.setDate(this.maxDate.getDate());
    }

    ngOnInit() {
      this.loader = CONFIGCONSTANTS.loaderConfig;
      this.routeSub = this.route.params
      .subscribe(params => {
        this._id = params['id'];
        this.viewMode = params['id'] != null;
        setTimeout(() => {
          this.initForm();
        }, 100);
      });
      this.getEmploymentStatus();
      this.getProductionType();
      this.getCountries();
    }

    initForm() {
      if (this.viewMode) {
        this.cookieService.set( 'get_id',''+ this._id +'');
        this.spinner.start();
        /* Set the value to Cookies with Edit Mode */
        this.jobData = this.jobService.getJobViewDetailById(this._id)
        .pipe(first())
        .subscribe(
          response => {
            this.spinner.stop();
            this.model = response.data;
            this.model.urgent_expiration_dt = response.data.urgent_expiration_dt || '';
            this.model.production_name = response.data.production_type[0].name;
            this.model.urgent_expiration_dt = response.data.urgent_expiration_dt == '0000-00-00 00:00:00' ? '' : moment(response.data.urgent_expiration_dt).format('MM/DD/YYYY');
            if (this.model.closed_at != null) {
              this.model.closed_at = moment(response.data.closed_at).format('MM/DD/YYYY');
            }            
          },
          error => {
            this.spinner.stop();
            console.log(error);
          });
        } else {
          /* Set the value to Cookies without Edit Mode */
          this.cookieService.set( 'get_id', undefined );
          /* Set the value to Cookies without Edit Mode */
        }
      }
        ngOnDestroy() {
          this.routeSub.unsubscribe();
        }

        /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, id, flag) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  decline(): void {
    this.modalRef.hide();
  }

  getEmploymentStatus() {
    this.jobService.getEmploymentStatus()
      .pipe(first())
      .subscribe(
        data => {
          this.statusList = data.data;
          // this.statusList.forEach(element => {
          //   this.empStatusList[element.id] = element.name;
          // });
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

  getProductionType() {
    this.jobService.getProductionType()
    .pipe(first())
    .subscribe(
    data => {
      this.prodTypeList = data.data;
      // this.statusList.forEach(element => {
      //   this.empStatusList[element.id] = element.name;
      // });
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

  getCountries() {
    this.countries=[];
    this.apiService.getRequest(CONFIG.getCountriesListURL)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.spinner.stop();
            this.countries=data.data.data;                      
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

  rerender(dtValue): void {
    this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
      if(index==dtValue){
        dtElement.dtInstance.then((dtInstance: any) => {
          dtInstance.draw();
        });
      }      
    });
  }

}
