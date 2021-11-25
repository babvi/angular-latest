import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HCCService } from './../../../_services/hcc.service';
import { Hcc } from './../../../model/hcc';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { CONFIGCONSTANTS } from '../../../config/app-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-hcc-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnDestroy, OnInit {
  modalRef: BsModalRef;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  loader:any;
  dtOptions: DataTables.Settings = {};
  hccList: Hcc[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  changeStatusId: string;
  data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  constructor(private hccService: HCCService, private toastr: ToastrService,private spinner:NgxUiLoaderService,
    private modalService: BsModalService, private permissionsService: NgxPermissionsService) { }

  ngOnInit() {
    this.loader = CONFIGCONSTANTS.loaderConfig;
    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    for (let per in permissions) {
      permsn.push(per)
    }
    // debugger
    
    columnsArry = [{ data: 'id', searchable: false }, { data: 'title' }, { data: 'description' }, { data: 'is_parent' }, { data: 'parent_title' }, { orderable: false, searchable: false }];
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        "search": "",
        "searchPlaceholder": 'Search',
      },
      stateSave: false,
      pageLength: 10,
      columns: columnsArry
    };
    this.getAllHCCList();
  }

  getAllHCCList(): void {
    this.spinner.start();
    this.hccService.getAllHCCList()
      .pipe(first())
      .subscribe(
        data => {
          this.spinner.stop();
          this.hccList = data.data;
          //Calling the DT trigger to manually render the table
          this.dtTrigger.next();
        },
        error => {
          this.spinner.stop();
          console.log(error);
        });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      //this.dtTrigger.next();
      this.getAllHCCList();
    });
  }


  openModal(template: TemplateRef<any>, id) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.changeStatusId = id;
  }

  confirm(): void {
   this.deleteCategory(this.changeStatusId);
  }

  decline(): void {
    this.modalRef.hide();
  }

  deleteCategory(id) {
    this.spinner.start();
    this.hccService.deleteHCC(id)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            
            this.modalRef.hide();
            this.spinner.stop();
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
  check()
  {
    var element=document.getElementById('helpCategory_info');
    
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
