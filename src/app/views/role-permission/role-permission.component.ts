import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { RolePermissionService } from './../../_services/role-permission.service';
import { Role } from './../../model/role';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { TreeviewItem, TreeviewConfig,TreeviewHelper} from 'ngx-treeview';
import { NgxPermissionsService } from 'ngx-permissions';
import { ApiService } from '../../_services/api.service';
import { CONFIG } from '../../config/app-config';
import { CONFIGCONSTANTS } from '../../config/app-constants';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnDestroy, OnInit {

  modalRef: BsModalRef;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('myModal') public myModal: ModalDirective;

  permissions=[];
  dtOptions: DataTables.Settings = {};
  roleList: Role[] = [];
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  changeStatusId: number;
  changeStatusType: string;
  changedStatus: string;
  permissions_arr;
  @ViewChild('roleForm') form: any;
  model: any = new Role('', 'Active');
  roleLoading: boolean = false;
  submitted: boolean = false;
  roleModalId: number;
  roleModalTitle: string;

  currRoleId: number = null;


  dropdownEnabled = true;
  items: TreeviewItem[];
  allPermissions: any[];
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  isPermissionSub: boolean = false;

  data_table_empty_msg:string=CONFIGCONSTANTS["Data-Table-Empty-error"];
  constructor(
    private toastr: ToastrService,
    private modalService: BsModalService,
    private permissionsService: NgxPermissionsService,
    private apiService:ApiService
  ) { }

  ngOnInit() {

    let permsn = [];
    let columnsArry = [];
    var permissions = this.permissionsService.getPermissions();
    this.permissions_arr=permissions;
    for (let per in permissions) {
      permsn.push(per)
    }
    if (permsn.indexOf('ROLE_UPDATE') == -1 && permsn.indexOf('ROLE_STATUS') == -1  && permsn.indexOf('SUPER_ADMIN') != 0) {
      columnsArry = [{ data: '', searchable: false }, { data: 'name' }, { data: 'status' }];
    } else {
      columnsArry = [{ data: '', searchable: false }, { data: 'name' }, { data: 'status' }, { orderable: false, searchable: false }];
    }

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
    this.apiService.getRequest(CONFIG.getAllRoleListURL)
      .pipe(first())
      .subscribe(
        data => {
          this.roleList = data.data;
          if (this.roleList.length) {
            this.currRoleId = data.data[0].id;
            this.getRolePermissions(this.currRoleId);
          } else {
            this.currRoleId = null;
          }
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

  saveRole() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;

    if (this.roleModalId) {
      this.updateRole(this.form.value, this.roleModalId);
    } else {
      this.createRole(this.form.value);
    }
  }

  createRole(formData) {
    this.apiService.postRequest(CONFIG.createRoleURL, formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.myModal.hide();
            this.rerender();
          }
        },
        error => {
          let errorData = error;
          if (errorData && errorData.meta) {
            if (errorData.meta.message_code == 'VALIDATION_ERROR') {
              if (errorData.errors.name) {
                this.toastr.error(errorData.errors.name[0]);
              }
            } else {
              this.toastr.error(errorData.meta.message);
            }
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
          this.submitted = false;
        });
  }

  updateRole(formData, id) {
    this.apiService.putRequest(CONFIG.updateRoleURL + id, formData)
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status) {
            this.toastr.success(data.meta.message);
            this.myModal.hide();
            this.rerender();
          }
        },
        error => {
          let errorData = error;
          if (errorData && errorData.meta) {
            this.toastr.error(errorData.meta.message);
          } else {
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

  openModal(template: TemplateRef<any>, id,status) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
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

    this.apiService.putRequest(CONFIG.changeRoleStatusURL, {id: id, status: this.changedStatus})
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

  getRolePermissions(id) {
    //this.items = this.rolePermissionService.getRolePermissions();
    const items: TreeviewItem[] = [];
    if (!id) {
      this.items = items;
      return;
    }
    let newArray = [];
    this.apiService.postRequest(CONFIG.getAllPermissionListURL, {'role_id': id})
    .subscribe(data => {
      this.allPermissions = data.data;
      for (let permission of this.allPermissions) {
        if (permission.parent == "#") {
          newArray[permission.id] = { 'text': permission.text, 'value': null, 'children': [] };
        } else {
          if(permission.text.toUpperCase()==('Add role to job vacancy').toLocaleUpperCase())
          {
            newArray[permission.parent].children.push({ 'text': permission.text, 'value': permission.id, 'checked': permission.state.selected ,'disabled':true});
          }else{
            newArray[permission.parent].children.push({ 'text': permission.text, 'value': permission.id, 'checked': permission.state.selected});            
          }
        }
      }
      for (let par in newArray) {
        const item = new TreeviewItem(newArray[par]);
        items.push(item);
      }
      this.items = items;
    });
  }

  // onFilterChange(value: string) {
  //      console.log('filter:', value);
  //  }

  savePermission() {
    this.isPermissionSub = true;
    if (!this.currRoleId) {
      this.toastr.error('Please select role');
      this.isPermissionSub = false;
      return;
    } else if (!this.values.length) {
      this.toastr.error('No permission seleted for operation');
      this.isPermissionSub = false;
      return;
    }

    this.apiService.postRequest(CONFIG.assignPermissionURL + this.currRoleId, {'permission_key': this.values.toString()})
      .pipe(first())
      .subscribe(
        data => {
          if (data.meta.status == true) {
            this.toastr.success(data.meta.message);
          }
          this.isPermissionSub = false;
        },
        error => {
          let statusError = error;
          if (statusError && statusError.meta) {
            this.toastr.error(statusError.meta.message);
          } else {
            this.toastr.error("Something went wrong please try again.");
          }
          this.isPermissionSub = false;
        });
  }
  check()
  {
    var element=document.getElementById('role_permission_table_info');
    
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
  onSelectedChange($event,treeview)
  {
    var array=[];
    array=array.concat(treeview.selection.checkedItems);
    array=array.concat(treeview.selection.uncheckedItems);
    var id=this.getPermissionValueByText(array,'Add role to job vacancy');
    var checkId=this.getPermissionValueByText(array,'Create new job vacancy');
    var id2=this.getPermissionValueByText(array,'Manage company logo');
    var checkId21=this.getPermissionValueByText(array,'Edit Company profile');
    var checkId22=this.getPermissionValueByText(array,'Create Company profile');
    
    if($event.includes(checkId))
    {
      TreeviewHelper.findItemInList(this.items,id).disabled=false;
      TreeviewHelper.findItemInList(this.items,id).checked=true;
      TreeviewHelper.findItemInList(this.items,id).disabled=true;
      if(!$event.includes(id))
      {
        $event.push(id);
      }
    }else{
      TreeviewHelper.findItemInList(this.items,id).disabled=false;
      TreeviewHelper.findItemInList(this.items,id).checked=false;
      TreeviewHelper.findItemInList(this.items,id).disabled=true;
      if($event.includes(id))
      {
        $event.splice($event.indexOf(id),1);
      }
    }

    if($event.includes(checkId21) || $event.includes(checkId22))
    {
      TreeviewHelper.findItemInList(this.items,id2).disabled=false;
      TreeviewHelper.findItemInList(this.items,id2).checked=true;
      TreeviewHelper.findItemInList(this.items,id2).disabled=true;
      if(!$event.includes(id2))
      {
        $event.push(id2);
      }
    }else{
      TreeviewHelper.findItemInList(this.items,id2).disabled=false;
      TreeviewHelper.findItemInList(this.items,id2).checked=false;
      TreeviewHelper.findItemInList(this.items,id2).disabled=true;
      if($event.includes(id2))
      {
        $event.splice($event.indexOf(id2),1);
      }
    }
    this.values=$event;
  }
  permissionExistOrNot(array,text)
  {
    return (array.filter(ele=>(ele.text.toUpperCase()==text.toUpperCase())).length>0)?true:false;
  }
  getPermissionValueByText(array,text)
  {
    return (array.filter(ele=>(ele.text.toUpperCase()==text.toUpperCase())))[0].value;
  }
}
