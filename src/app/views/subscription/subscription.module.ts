import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubscriptionComponent } from './subscription.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@NgModule({
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    NgxPermissionsModule,
    NgxSpinnerModule,
    NgxUiLoaderModule,
    FormsModule
  ],
  declarations: [SubscriptionComponent, SubscriptionListComponent]
})
export class SubscriptionModule { }
