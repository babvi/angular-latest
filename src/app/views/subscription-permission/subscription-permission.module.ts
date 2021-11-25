import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubPermissionComponent } from './subscription-permission.component';
import { SubPermissionRoutingModule } from './subscription-permission-routing.module';
import { SubPermissionListComponent } from './subscription-permission-list/subscription-permission-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubPermissionRoutingModule,
    CKEditorModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgxUiLoaderModule
  ],
  declarations: [SubPermissionComponent, SubPermissionListComponent]
})
export class SubPermissionModule { }
