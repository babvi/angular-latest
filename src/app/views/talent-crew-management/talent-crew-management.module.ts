import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentCrewManagementRoutingModule } from './talent-crew-management-routing.module';
import { TalentCrewManagementComponent } from './talent-crew-management.component';
import { TalentCrewListComponent } from './talent-crew-list/talent-crew-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddEditTalentCrewComponent } from './add-edit-talent-crew/add-edit-talent-crew.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
@NgModule({
  imports: [
    CommonModule,
    TalentCrewManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgbModule,
    NgxSpinnerModule,
    NgxUiLoaderModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxDaterangepickerMd.forRoot()

  ],
  declarations: [TalentCrewManagementComponent, TalentCrewListComponent, AddEditTalentCrewComponent]
})
export class TalentCrewManagementModule { }
