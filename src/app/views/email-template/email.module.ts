import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailComponent } from './email.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailAddEditComponent } from './email-add-edit/email-add-edit.component';
import { EmailListComponent } from './email-list/email-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmailRoutingModule,
    CKEditorModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgxUiLoaderModule
  ],
  declarations: [EmailComponent, EmailAddEditComponent, EmailListComponent]
})
export class EmailModule { }
