import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolePermissionRoutingModule } from './role-permission-routing.module';
import { RolePermissionComponent } from './role-permission.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { RolesComponent } from './roles/roles.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    RolePermissionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxPermissionsModule,
    ModalModule.forRoot(),
    TreeviewModule.forRoot(),
  ],
  declarations: [RolePermissionComponent, PermissionsComponent, RolesComponent]
})
export class RolePermissionModule { }
