import { Component, OnDestroy, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { SubscriptionService } from './../../../_services/subscription.service';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxUiLoaderService} from 'ngx-ui-loader';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  modalRef: BsModalRef;
  // activeRoleList: Subscription;
  ManagesubscriptionList: any[] = [];
  empty_error_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  date_formate=CONFIGCONSTANTS["date-formate"];
  currency = CONFIGCONSTANTS["currency"];
  loader:any;
  subDetail: any = {};
  changeStatusType = '';
  subUuid: string = '';

  constructor(private subscriptionService: SubscriptionService, private toastr: ToastrService,
    private modalService: BsModalService,private permissionsService: NgxPermissionsService,
    private spinner:NgxUiLoaderService,private router:Router) { }

  ngOnInit() {
    this.loader = CONFIGCONSTANTS.loaderConfig;
    this.getAllSubscriptionList();
  }

  /* Getting List Data */
  getAllSubscriptionList() {
    this.spinner.start();
    this.subscriptionService.getSubscriptionList()
    .subscribe(
    data => {
      this.spinner.stop();
      this.ManagesubscriptionList = data.data;
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

  /* Open any Modal Popup */
  openModal(template: TemplateRef<any>, obj, flag) {
    if(flag == 'status') {
      this.changeStatusType = obj.status;
      this.subUuid = obj.uuid;
    } else {
      this.subDetail = obj;
      this.subDetail.amt = obj.amount;
      this.subDetail.productName = this.subDetail.plan_type == '1' ? 'Monthly Premium' : 'Yearly Premium'
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-md', backdrop: 'static' });
  }

  decline(): void {
    this.modalRef.hide();
    this.subDetail = {};
  }

  onSubscriptionSave(frm: NgForm) {
    if(frm.invalid == true) {
      return;
    }
    let data = {
      amount: this.subDetail.amt,
      subscription_uuid: this.subDetail.uuid
    }
    this.spinner.start();
    this.subscriptionService.updateSubscription(data)
    .subscribe(
    data => {
      this.spinner.stop();
      this.decline();
      this.toastr.success(data.meta.message);
      this.getAllSubscriptionList();
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

  changeStatus() {
    let data = {
      status: this.changeStatusType == 'Active' ? 'Inactive' : 'Active',
      subscription_uuid: this.subUuid
    }
    this.spinner.start();
    this.subscriptionService.changeStatus(data)
    .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
            this.getAllSubscriptionList();
            this.spinner.stop();
            this.modalRef.hide();
            
            
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

  ngOnDestroy(): void {
    // this.activeRoleList.unsubscribe();
  }
getDateInMMDDYYformate(date)
{
  return moment(date).format('MM/DD/YYYY');
}

}
