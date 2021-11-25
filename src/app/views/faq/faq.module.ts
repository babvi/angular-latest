import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqAddEditComponent } from './faq-add-edit/faq-add-edit.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaqRoutingModule,
    CKEditorModule,
    DataTablesModule,
    NgxPermissionsModule,
  ],
  declarations: [FaqComponent, FaqAddEditComponent, FaqListComponent]
})
export class FaqModule { }
