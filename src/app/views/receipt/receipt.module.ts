import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReceiptComponent } from './receipt.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptRoutingModule } from './receipt-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReceiptRoutingModule,
    DataTablesModule,
    NgxPermissionsModule,
    NgxSpinnerModule,
    NgxUiLoaderModule,
    BsDatepickerModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  declarations: [ReceiptComponent, ReceiptListComponent],
  providers: [ CookieService ]
})
export class ReceiptModule { }
