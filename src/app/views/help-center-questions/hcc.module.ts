import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HCCComponent } from './hcc.component';
import { HCCRoutingModule } from './hcc-routing.module';
import { ManageComponent } from './manage/manage.component';
import { ListComponent } from './list/list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '../../containers/shared-module/shared-module.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HCCRoutingModule,
    CKEditorModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgxUiLoaderModule,    
    SharedModule
  ],
  declarations: [HCCComponent, ListComponent, ManageComponent]
})
export class HCCModule { }
