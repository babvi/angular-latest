import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryAddEditComponent } from './category-add-edit/category-add-edit.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryTreeviewComponent } from './category-treeview/category-treeview.component'
import { CKEditorModule } from 'ngx-ckeditor';
import { DataTablesModule } from 'angular-datatables';
import { TreeviewModule } from 'ngx-treeview';
import { TreeModule } from 'angular-tree-component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule,
    CKEditorModule,
    DataTablesModule,
    TreeModule,
    NgxPermissionsModule,
    TreeviewModule.forRoot(),
  ],
  declarations: [CategoryComponent, CategoryAddEditComponent, CategoryListComponent, CategoryTreeviewComponent]
})
export class CategoryModule { }
