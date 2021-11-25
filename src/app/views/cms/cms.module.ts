import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms-routing.module';
import { CmsAddEditComponent } from './cms-add-edit/cms-add-edit.component';
import { CmsListComponent } from './cms-list/cms-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmsRoutingModule,
    CKEditorModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgxUiLoaderModule
  ],
  declarations: [CmsComponent, CmsAddEditComponent, CmsListComponent]
})
export class CmsModule { }
