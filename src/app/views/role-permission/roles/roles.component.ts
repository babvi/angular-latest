import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { RolePermissionService } from './../../../_services/role-permission.service';
import { Role } from './../../../model/role';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnDestroy, OnInit {
  modalRef: BsModalRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('myModal') public myModal: ModalDirective;

  dtOptions: DataTables.Settings = {};
  roleList: Role[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  changeStatusId: number;
  changeStatusType: string;
  changedStatus: string;

  @ViewChild('roleForm') form: any;
  model: any = new Role('', 'Active');
  roleLoading: boolean = false;
  submitted: boolean = false;
  roleModalId: number;
  roleModalTitle: string;


	constructor( private rolePermissionService: RolePermissionService,
	 private toastr: ToastrService, 
	 private modalService: BsModalService
	   ) { }
 
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      stateSave: false,
      pageLength: 10,
      columns: [{ data: '', searchable: false }, { data: 'name' }, { data: 'status' }, { orderable: false, searchable: false }]
    };
    this.getAllRoleList();
    // this.http.get<any>(CONFIG.getAllCmsListURL)
    //   .map(this.extractData)
    //   .subscribe(cmsList => {
    //     this.cmsList = cmsList;
    //     // Calling the DT trigger to manually render the table
    //     this.dtTrigger.next();
    // id' });
  }

  onHidden(): void {
  	this.form.reset();
  }

  getAllRoleList(): void {
    this.rolePermissionService.getAllRoleList()
      .pipe(first())
      .subscribe(
          data => {
        this.roleList = data.data;
        //Calling the DT trigger to manually render the table
        this.dtTrigger.next();
      },
      error => {
          console.log(error);  
    });
  }

  addRole() {
  	this.roleModalTitle = 'Add New Role';
  	this.model = new Role('', 'Active'); 
  	this.roleModalId = null;
  	this.myModal.show();
  }

  editRole(id, name, status) {
  	this.roleModalTitle = 'Update Role [' + name + ']';
  	this.model = new Role(name, status); 
  	this.roleModalId = id;
  	this.myModal.show();
  }

  saveRole(){
  	// stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;

    if(this.roleModalId){
  			this.updateRole(this.form.value, this.roleModalId);
	} else{
		this.createRole(this.form.value);
	}
  }

  	createRole(formData) {
  		this.rolePermissionService.createRole(formData)
      	.pipe(first())
      	.subscribe(
          data => {
              	if(data.meta.status){
              		this.toastr.success(data.meta.message);
              		this.myModal.hide();		
              		this.rerender();
              	}
          },
          error => {
			let errorData=error;
			if (errorData && errorData.meta) {
			if (errorData.meta.message_code == 'VALIDATION_ERROR') {
			  if(errorData.errors.name){
			    this.toastr.error(errorData.errors.name[0]);
			  }
			}else{
			    this.toastr.error(errorData.meta.message);
			}
			}else {
				this.toastr.error("Something went wrong please try again.");
			}
			this.submitted = false;
    	});
  	}

  	updateRole(formData, id) {
  		this.rolePermissionService.updateRole(formData, id)
      	.pipe(first())
      	.subscribe(
          data => {
              	if(data.meta.status){
              		this.toastr.success(data.meta.message);
              		this.myModal.hide();
              		this.rerender();
              	}
          },
          error => {
			let errorData=error;
			if (errorData && errorData.meta) {
			  this.toastr.error(errorData.meta.message);
			}else {
				this.toastr.error("Something went wrong please try again.");
			}
			this.submitted = false;
    	});
  	}


  	rerender(): void {
	    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
	      // Destroy the table first
	      dtInstance.destroy();
	      // Call the dtTrigger to rerender again
	      //this.dtTrigger.next();
	      this.getAllRoleList();
	    });
  	}

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  openModal(template: TemplateRef<any>, id, status) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.changeStatusId = id;
    this.changeStatusType = status;
  }

  confirm(): void {
    this.changeStatus(this.changeStatusId, this.changeStatusType);
  }
 
  decline(): void {
    this.modalRef.hide();
  }

  changeStatus(id, status) {
    this.changedStatus = status == 'Active' ? 'Inactive' : 'Active';
    this.rolePermissionService.changeRoleStatus(this.changedStatus, id)
      .pipe(first())
      .subscribe(
          data => {
            if(data.meta.status == true){
        		this.modalRef.hide();
        		this.toastr.success(data.meta.message);
              	this.rerender();
            }
      },
      error => {
      	let statusError=error;
        if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
        } else {
            this.toastr.error("Something went wrong please try again.");
        }
    });
  }


}
