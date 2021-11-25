import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageJobRoutingModule } from './manage-job-routing.module';
import { ManageJobComponent } from './manage-job.component';
import { ManageJobListComponent } from './manage-job-list/manage-job-list.component';
import { DataTablesModule } from 'angular-datatables';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ManageJobViewComponent } from './manage-job-view/manage-job-view.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManageJobRoutingModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxUiLoaderModule,
    NgMultiSelectDropDownModule.forRoot(),
    TabsModule
  ],
  declarations: [ManageJobComponent, ManageJobViewComponent, ManageJobListComponent],
  providers: [ CookieService ]
})
export class ManageJobModule { }
