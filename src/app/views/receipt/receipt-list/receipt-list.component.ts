import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { SubscriptionService } from './../../../_services/subscription.service';
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
import { NgxUiLoaderService} from 'ngx-ui-loader';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit {

  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  // activeRoleList: Subscription;
  ManagereceiptList: any[] = [];
  receiptDetail: any = {};
  empty_error_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  date_formate=CONFIGCONSTANTS["date-formate"];
  _id = '';
  retailer_name: string = '';
  loader:any;
  routeSub: Subscription;
  frontURL=environment.frontEndURL;
  companyProfileURL = CONFIG.companyProfileURL;
  company_name: string = '';
  customer_name: string = '';
  customer_email: string = '';
  order_status: string = '';
  plan_type: string = '';
  fromDate: string = '';
  toDate: string = '';
  download_file_url='';
  rstatus = '';
  previous_search_json;
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
  constructor(private apiService:ApiService,private subscriptionService: SubscriptionService, private toastr: ToastrService,
    private modalService: BsModalService,private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService,private router:Router, private route: ActivatedRoute) { }

    isInit:string = 'NO';
    pageLength:number = 10;
    startPageNumber:number = 0;
    defaultColumn:number = 5;
    defaultSort:string = 'desc';

  ngOnInit() {
   this.rstatus = this.route.snapshot.queryParamMap.get('rstatus');
   if(this.rstatus!='' && this.rstatus!=null) {
     this.order_status = this.rstatus;
   }
    var getPreviousData = this.apiService.getListingResume(CONFIGCONSTANTS.receiptManageList);
    if (getPreviousData && this.rstatus=='') {
      this.isInit = 'YES';
      this.defaultColumn = getPreviousData.order[0].column;
      this.defaultSort = getPreviousData.order[0].dir;
      this.pageLength = getPreviousData.length;
      this.startPageNumber = getPreviousData.start;
      this._id = getPreviousData.employer_uuid;
      this.company_name = getPreviousData.company_name;
      this.customer_name = getPreviousData.customer_name;
      this.customer_email = getPreviousData.customer_email;
      this.order_status = getPreviousData.order_status;
      this.plan_type = getPreviousData.plan_type;
      if (getPreviousData.date_obj && getPreviousData.date_obj.start && getPreviousData.date_obj.end) {
        this.selected_days = {
          start:moment(getPreviousData.date_obj.start),
          end:moment(getPreviousData.date_obj.end)
        };
      }
    }
    this.routeSub = this.route.params
      .subscribe(params => {
      this._id = params['id'] || '';
      setTimeout(() => {
        
      }, 100);
    });
    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.getAllReceiptListURL();
  }

  /* Getting List Data */
  getAllReceiptListURL() {
    this.spinner.start();
    const that = this;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: 'company_name' }, { data: 'customer_name' }, { data: 'customer_email' }, { data: 'plan_type' }, { data: 'fort_id' }, { data: 'amount'}, {data: 'order_status'}, { data: 'payment_dt' }, { data: 'nxt_payment_dt' }]
    } else {
      columnsArry = [{ data: 'company_name' }, { data: 'customer_name' }, { data: 'customer_email' }, { data: 'plan_type' }, { data: 'fort_id' }, { data: 'amount'}, {data: 'order_status'}, { data: 'payment_dt' }, { data: 'nxt_payment_dt' }, { data: '', orderable: false }];
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
        this.previous_search_json= Object.assign(dataTablesParameters,{
          requestType: 'admin', 
          employer_uuid : this._id,
          min_created_at: this.selected_days.start?moment(this.selected_days.start).format('YYYY-MM-DD'):"",
          max_created_at: this.selected_days.end?moment(this.selected_days.end).format('YYYY-MM-DD'):"",
          company_name: this.company_name,
          customer_name: this.customer_name,
          customer_email: this.customer_email,
          order_status: this.order_status,
          plan_type: this.plan_type
         });

        if (this.isInit == 'YES') {
          this.isInit = 'NO';
          // Get the previous searched and saved data
          this.previous_search_json = this.apiService.getListingResume(CONFIGCONSTANTS.receiptManageList);
          var sortOn = this.previous_search_json.order[0];
          // set previous sorting and render
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.order.apply('order',[[sortOn.column, sortOn.dir]]);
          });
        }

         this.apiService.postRequest(CONFIG.getReceiptListURL, this.previous_search_json)      
          .pipe(first())
          .subscribe(resp => {
            // Add date object to the local instance data
            this.previous_search_json['date_obj'] = this.selected_days;
            // Set and store previous data to local
            this.apiService.setListingResume(CONFIGCONSTANTS.receiptManageList, this.previous_search_json);
            this.spinner.stop();
            that.ManagereceiptList = resp.data['original'].data;
            this.retailer_name = resp.data.retailer_name;
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
  openModal(template: TemplateRef<any>, index) {
    this.receiptDetail = this.ManagereceiptList[index];
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  decline(): void {
    this.modalRef.hide();
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

  check()
  {
    var element=document.getElementById('receipt_table_info');
    
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

public downloadReceiptPDF()
{
  this.spinner.start();
  var data = document.getElementById('receipt');
  document.getElementById('pdfFlag1').style.display = 'none';
  document.getElementById('pdfFlag2').style.display = 'none';
  html2canvas(data).then(canvas => {
  // Few necessary setting options
  document.getElementById('pdfFlag1').style.display = 'inline-block';
  document.getElementById('pdfFlag2').style.display = 'block';
  var imgWidth = 190;
  var imgHeight = canvas.height * imgWidth / canvas.width;
  const contentDataURL = canvas.toDataURL('image/png')
  let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
  var position = 10;
  pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight)
  pdf.save('receipt' + (this.receiptDetail.fort_id == null ? '' : '_' + this.receiptDetail.fort_id) + '.pdf'); // Generated PDF
  this.spinner.stop();
  });
}

searchApply() {
  this.rerender();
}

resetSearch() {
  this.order_status = '';
  this.fromDate='';
  this.toDate='';
  this.customer_name=''
  this.company_name = '';
  this.plan_type='';
  this.customer_email = '';
  this.selected_days = '';
  this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.order.apply('order',[[0, 'desc']]);
 });
  this.rerender();
}

downloadReport() {  
  this.spinner.start();
  this.apiService.postRequest(CONFIG.getReceiptReport,this.previous_search_json)
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
downloadReportPDF() {  
  this.spinner.start();
  this.apiService.postRequest(CONFIG.getReceiptReportPDF,this.previous_search_json)
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

getResponseCode(code) {
  return code.substr(code.length - 3);
}

}
