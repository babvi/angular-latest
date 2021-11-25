import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRecommendationsRoutingModule } from './manage-recommendations-routing.module';
import { RecommendationsListComponent } from './recommendations-list/recommendations-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ManageRecommendationsComponent } from './manage-recommendations.component';
@NgModule({
  imports: [
    CommonModule,
    ManageRecommendationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgbModule,
    BsDatepickerModule.forRoot(),
    NgxSpinnerModule,
    NgxUiLoaderModule
  ],
  declarations: [RecommendationsListComponent, ManageRecommendationsComponent]
})
export class ManageRecommendationsModule { }
