import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageProfilePropertiesRoutingModule } from './manage-profile-properties-routing.module';
import { ManageProfilePropertiesComponent } from './manage-profile-properties.component';
import { DataTablesModule } from 'angular-datatables';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TreeviewModule } from 'ngx-treeview';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { CONFIG } from './../../config/app-config';

import { SharedModule } from '../../containers/shared-module/shared-module.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageProfilePropertiesRoutingModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgbModule,
    NgxUiLoaderModule,
    NgxSpinnerModule,
    TreeviewModule.forRoot(),
    SharedModule
  ],
  declarations: [ManageProfilePropertiesComponent, ListComponent, ManageComponent],
  providers: [ CookieService ]
})
export class ManageProfilePropertiesModule { }
