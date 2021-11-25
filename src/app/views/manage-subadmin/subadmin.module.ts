import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubadminComponent } from './subadmin.component';
import { SubadminRoutingModule } from './subadmin-routing.module';
import { SubadminAddEditComponent } from './subadmin-add-edit/subadmin-add-edit.component';
import { SubadminListComponent } from './subadmin-list/subadmin-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubadminRoutingModule,
    CKEditorModule,
    DataTablesModule,
    NgxPermissionsModule,
  ],
  declarations: [SubadminComponent, SubadminAddEditComponent, SubadminListComponent]
})
export class SubadminModule { }
