import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUserRoutingModule } from './manage-user-routing.module';
import { ManageUserComponent } from './manage-user.component';
import { ManageUserAddEditComponent } from './manage-user-add-edit/manage-user-add-edit.component';
import { ManageUserListComponent } from './manage-user-list/manage-user-list.component';
import { DataTablesModule } from 'angular-datatables';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageUserRoutingModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxUiLoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  declarations: [ManageUserComponent, ManageUserAddEditComponent, ManageUserListComponent],
  providers: [ CookieService ]
})
export class ManageUserModule { }
